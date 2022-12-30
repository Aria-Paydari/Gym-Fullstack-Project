########################################################################################################################
# IMPORTS
########################################################################################################################
from datetime import datetime
from math import sin, radians, sqrt, asin, cos
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.status import *
from rest_framework.views import APIView
from accounts.models import Member
from places.models import Class, Studio
from places.serializers import LocationSerializer, AmenitiesSerializer, StudioFilterSerializer, ClassFilterSerializer, \
    ScheduleStudioSerializer


########################################################################################################################
# TIME AND DATE HELPER FUNCTIONS
########################################################################################################################

def _add_history(hist, time):
    lst = hist.split(",")
    lst.append(time)
    return lst


# Input queryset of classes and returns weekly schedule
def _get_schedule(queryset):
    schedule = {"Sunday": [], "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [],
                "Saturday": []}
    now = datetime.now()

    for c in queryset:
        times = c.times.split("|")
        t1 = times[3][:2] + " " + times[3][2:4] + " " + times[3][4:] + " " + times[1]
        t2 = times[4][:2] + " " + times[4][2:4] + " " + times[4][4:] + " " + times[2]
        # print("this is t1: " + t1)
        # print("this is t1: " + t2)
        time1 = datetime.strptime(t1, '%m %d %y %H:%M')  # Start
        time2 = datetime.strptime(t2, '%m %d %y %H:%M')  # End

        diff = time1 - now
        # print(diff)
        if time2 >= now and not diff.days > 6:
            # (name, start, end, description, keywords, capacity, coach)
            classtime = (
                c.name, str(time1.time())[:-3], str(time2.time())[:-3], c.description, c.keywords, c.capacity, c.coach)
            schedule[times[0]].append(classtime)

    # Sort each day by start time
    for i in schedule:
        schedule[i].sort(key=lambda y: y[1])

    return schedule


def _get_datetimes(times):
    lst_time = times.split("|")
    year = datetime.now().year
    start = lst_time[3][:2] + " " + lst_time[3][2:4] + " " + lst_time[3][4:] + " " + lst_time[2]
    end = lst_time[4][:2] + " " + lst_time[4][2:4] + " " + lst_time[4][4:] + " " + lst_time[1]
    start = datetime.strptime(start, '%m %d %y %H:%M')
    end = datetime.strptime(end, '%m %d %y %H:%M')
    return (start, end)


########################################################################################################################
# CLASS MANAGER VIEW
########################################################################################################################

class ClassManagerView(APIView):

    # USER SCHEDULE REQUEST
    def get(self, request, format=None):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        member = Member.objects.get(user_id=request.user.id)
        if not member.subscription:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        classes = member.classes.all()
        schedule = _get_schedule(classes)

        return JsonResponse(schedule, status=status.HTTP_200_OK)

    # ENROL/DROP REQUEST
    # Body format:
    # {
    #     "name": "classname",
    #     "request": "drop/enrol"
    # }
    def post(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        for i in request.data:
            if i not in ['name', 'request']:
                return Response({i: 'incorrect parameter detected'}, status=HTTP_400_BAD_REQUEST)

        member = Member.objects.get(user_id=request.user.id)
        if not member.subscription:
            return Response({"not subscribed"}, status=status.HTTP_401_UNAUTHORIZED)

        name = request.data.get('name')
        action = request.data.get('request')

        if name == None or action == None:
            return Response({'Expected format: {"name":"","request":""}'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            instance = Class.objects.filter(name=name).get()
            time = instance.times
        except:
            return Response({"Class does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        exists = member.classes.filter(id=instance.id).exists()

        dates = _get_datetimes(time)
        today = datetime.now()

        # Enroll Class
        if action == "enroll":
            if exists:
                return Response({"Already Enrolled"}, status=status.HTTP_200_OK)
            elif today > dates[0]:
                return Response({"Registration Date Passed"}, status=status.HTTP_200_OK)
            elif instance.capacity < 1:
                return Response({"Class is Full"}, status=status.HTTP_200_OK)
            else:
                instance.capacity = instance.capacity - 1
                instance.save()
                history = _add_history(member.class_history, time + "|" + instance.name)
                member.class_history = ','.join(history)
                member.classes.add(instance)
                member.save()
                return Response({"Enrolled"}, status=status.HTTP_202_ACCEPTED)

        # Drop Class
        elif action == "drop":
            if not exists:
                return Response({"Not Enrolled"}, status=status.HTTP_200_OK)
            else:
                instance.capacity = instance.capacity + 1
                instance.save()
                member.classes.remove(instance)
                # history = _del_history(member.class_history, time)
                # member.class_history = ','.join(history)
                member.save()
                return Response({"Dropped"}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response({"Not valid action: enroll/drop"}, status=status.HTTP_400_BAD_REQUEST)


########################################################################################################################
# CLASS HISTORY VIEW
########################################################################################################################

class ClassHistory(APIView):

    def get(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        member = Member.objects.get(user_id=request.user.id)
        if not member.subscription:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        history_string = member.class_history[1:]
        hist_items = history_string.split(",") # get list of class history

        history = []
        today = datetime.now()

        for item in hist_items:
            dates = _get_datetimes(item) # get start and end date
            name = item.split("|")[-1] # get class name
            week_day = dates[0].weekday() # get day of week
            for d_ord in range(dates[0].toordinal(), dates[1].toordinal()): # range of days between start and end
                day = datetime.fromordinal(d_ord) 
                if (day.weekday() == week_day): # if days are same
                    if day <= today: # if day has occured
                        history.append((str(day.date()), name))

        history.sort(key=lambda y: y[0])
        return JsonResponse(history, safe=False, status=status.HTTP_202_ACCEPTED)


########################################################################################################################
# POLAR COORDINATE HELPER FUNCTIONS
########################################################################################################################


# this function is taken from:
# https://stackoverflow.com/questions/4913349/haversine-formula-in-python-bearing-and-distance-between-two-gps-points
# this is an extremely common function found in multivariable calculus it is called the haversine function
# (https://en.wikipedia.org/wiki/Haversine_formula) and is used to calculate the arc distance on a sphere between
# two points given a radius
def haversine(lon1, lat1, lon2, lat2):
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    r = 6371
    return c * r


def coordinate_sorter(coordinates, initial_coordinate):
    distances = []
    for coord in coordinates:
        distance = haversine(coord[1], coord[0], initial_coordinate[1], initial_coordinate[0])
        distances.append((distance, coord))
    distances.sort(key=lambda x: x[0])
    return [x[1] for x in distances]


########################################################################################################################
# NEARBY STUDIOS VIEW
########################################################################################################################

class NearbyStudiosView(APIView):
    serializer_class = LocationSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            studios = []
            init_coord = (request.data['latitude'], request.data['longitude'])
            for studio in Studio.objects.all():
                curr_coord = studio.location.split(',')
                studios.append(
                    (studio, haversine(init_coord[1], init_coord[0], float(curr_coord[1]), float(curr_coord[0]))))
            studios.sort(key=lambda x: x[1])
            response = []
            for studio in studios:
                lat = str(studio[0].location).split(',')[0]
                lon = str(studio[0].location).split(',')[1]
                response.append({"name": studio[0].name,
                                 "address": studio[0].address,
                                 "location": studio[0].location,
                                 "postal_code": studio[0].postal_code,
                                 "phone_number": studio[0].phone_number,
                                 "images": studio[0].images,
                                 "amenities": studio[0].amenities,
                                 "distance": str(studio[1]) + "km",
                                 "directions": f"https://www.google.com/maps/dir//{lat},{lon}/@{lat},{lon},17z/data=!4m2!4m1!3e0".replace(' ', '') })
            return JsonResponse(response, safe=False)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


########################################################################################################################
# GET STUDIO VIEW
########################################################################################################################

class GetStudio(APIView):
    def get(self, request, studio_name):
        if not Studio.objects.filter(name=studio_name).exists():
            return Response(f"studio with name {studio_name} does not exist", status=HTTP_404_NOT_FOUND)
        else:
            studio = Studio.objects.get(name=studio_name)
            lat = str(studio.location).split(',')[0]
            lon = str(studio.location).split(',')[1]
            return Response({
                "name": studio.name,
                "address": studio.address,
                "location": studio.location,
                "postal_code": studio.postal_code,
                "phone_number": studio.phone_number,
                "images": studio.images,
                "amenities": studio.amenities,
                "directions": f"https://www.google.com/maps/dir//{lat},{lon}/@{lat},{lon},17z/data=!4m2!4m1!3e0".replace(' ', '')
            }, status=HTTP_200_OK)


########################################################################################################################
# UPDATE AMENITIES VIEW
########################################################################################################################


class UpdateAmenitiesView(APIView):
    serializer_class = AmenitiesSerializer

    def post(self, request, studio_name):
        if not request.user.is_superuser:
            return Response("Must be admin", status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            studio = Studio.objects.get(name=studio_name)
            type = request.data['type']
            quantity = request.data['quantity']
            amenities = studio.amenities
            amenities_dict = {}
            if amenities != '':
                elements = amenities.split(',')
                for element in elements:
                    item = element.split(':')
                    amenities_dict[item[0]] = item[1]
            amenities_dict[type] = str(quantity)
            new_amenities_str = ""
            for i in amenities_dict.keys():
                new_amenities_str += f"{i}:{amenities_dict[i]},"
            studio.amenities = new_amenities_str[:-1]
            studio.save()
            return Response(f"Updated amenities: {amenities_dict}", status=HTTP_200_OK)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


########################################################################################################################
# FILTER STUDIOS VIEW
########################################################################################################################

class FilterStudios(APIView):
    serializer_class = StudioFilterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            body = request.data
            names = []
            studios = []

            if body['type'] == "name":
                studios = Studio.objects.filter(name=body['value'])
            if body['type'] == "amenities":
                base_studios = Studio.objects.filter().all()
                for x in base_studios:
                    amenities = x.amenities.split(',')
                    for y in amenities:
                        y = y.replace(' ', '')
                        if body['value'].replace(' ', '') == y.split(':')[0]:
                            studios.append(x)
            if body['type'] == "class_name":
                studios = Studio.objects.filter(classes__name=body['value'])
            if body['type'] == "coach":
                studios = Studio.objects.filter(classes__coach=body['value'])
            for i in studios:

                lat = str(i.location).split(',')[0]
                lon = str(i.location).split(',')[1]
                names.append({
                "name": i.name,
                "address": i.address,
                "location": i.location,
                "postal_code": i.postal_code,
                "phone_number": i.phone_number,
                "images": i.images,
                "amenities": i.amenities,
                "directions": f"https://www.google.com/maps/dir//{lat},{lon}/@{lat},{lon},17z/data=!4m2!4m1!3e0".replace(' ', '')
            })
            return Response(names, status=HTTP_200_OK)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


########################################################################################################################
# FILTER CLASSES VIEW
########################################################################################################################

class FilterClasses(APIView):
    serializer_class = ClassFilterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            studio_name = request.data['studio_name']
            key = request.data['type']
            value = request.data['value']

            names = []
            classes = []
            base_classes = Class.objects.filter(studio__name=studio_name)
            if key == "class_name":
                classes = base_classes.filter(name=value)
            if key == "coach":
                classes = base_classes.filter(coach=value)
            if key == "date":
                classes = []
                for x in base_classes:
                    times = x.times.split(',')
                    for y in times:
                        start_time = str(y.split('|')[-2])
                        month = int(start_time[:2])
                        day = int(start_time[2:4])
                        year = int("20" + start_time[4:])
                        start_date = datetime(year, month, day)

                        value_month = int(value[:2])
                        value_day = int(value[2:4])
                        value_year = int("20" + value[4:])

                        value_date = datetime(value_year, value_month, value_day)

                        if start_date > value_date:
                            classes.append(x)
            # expect input: HH:MM,HH:MM
            if key == "time_range":
                classes = []
                for x in base_classes:
                    times = x.times.split(',')
                    for y in times:
                        start_time = str(y.split('|')[1])
                        end_time = str(y.split('|')[2])

                        value_start_time = value.split(',')[0]
                        value_end_time = value.split(',')[1]

                        if value_start_time <= start_time and end_time <= value_end_time:
                            classes.append(x)
            for i in classes:
                names.append({"name": i.name,
                                 "description": i.description,
                                 "keywords": i.keywords,
                                 "capacity": i.capacity,
                                 "coach": i.coach,
                                 "times": i.times,})
            return Response(names, status=HTTP_200_OK)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


########################################################################################################################
# SCHEDULE STUDIOS VIEW
########################################################################################################################

class ScheduleStudioView(APIView):
    serializer_class = ScheduleStudioSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            base_classes = Class.objects.filter(studio__name=request.data['studio_name'])
            schedule = _get_schedule(base_classes)
            return Response(schedule, status=HTTP_200_OK)
        else:
            return Response(status=HTTP_400_BAD_REQUEST)
       
