########################################################################################################################
# IMPORTS
########################################################################################################################


import datetime
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_framework.views import APIView
from accounts.models import Member
from accounts.serializers import CreditSerializer, CombinedUserMemberSerializer, ProfileSerializer


########################################################################################################################
# MEMBER REGISTRATION
########################################################################################################################

class MemberRegister(APIView):
    serializer_class = CombinedUserMemberSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = User.objects.create_user(username=request.data['username'],
                                            password=request.data['password'],
                                            email=request.data['email'],
                                            first_name=request.data['first_name'],
                                            last_name=request.data['last_name'])
            user.save()

            member = Member.objects.create(user=user,
                                           timestamp=datetime.datetime.now(),
                                           phone_number=request.data['phone_number'],
                                           avatar=request.data['avatar'],
                                           credit_card=request.data['credit_card'],
                                           payment_history="")
            member.save()

            assert member.user.id == user.id

            return Response({"Registered"}, status=status.HTTP_201_CREATED)
        else:
            Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


########################################################################################################################
# MEMBER PROFILE
########################################################################################################################

class MemberProfile(APIView):
    serializer_class = ProfileSerializer

    def get(self, request):
        if request.user.is_authenticated:
            member = Member.objects.get(user=request.user)
            return JsonResponse({'first_name': request.user.first_name,
                                 'last_name': request.user.last_name,
                                 'email': request.user.email,
                                 'avatar': member.avatar,
                                 'phone_number': member.phone_number})
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if request.user.is_authenticated:
            if serializer.is_valid():
                user = request.user
                member = Member.objects.get(user=user)
                body = request.data

                if 'first_name' in request.data:
                    user.first_name = str(request.data['first_name'])
                if 'last_name' in request.data:
                    user.last_name = request.data['last_name']
                if 'email' in request.data:
                    user.email = request.data['email']
                if 'avatar' in request.data:
                    member.avatar = request.data['avatar']
                if 'phone_number' in request.data:
                    member.phone_number = request.data['phone_number']

                user.save()
                member.save()

                return JsonResponse({'first_name': request.user.first_name,
                                     'last_name': request.user.last_name,
                                     'email': request.user.email,
                                     'avatar': member.avatar,
                                     'phone_number': member.phone_number}, status=HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


########################################################################################################################
# PAYMENT VIEW
########################################################################################################################


class PaymentView(APIView):
    """
    List all snippets, or create a new snippet.
    """

    def get(self, request, format=None):
        if not request.user.is_authenticated:
            return JsonResponse({"Error": "You need to be logged in."}, safe=False, status=status.HTTP_401_UNAUTHORIZED)
        member = Member.objects.filter(user=request.user.id)[0]
        if request.method == 'GET':
            history = member.payment_history
            fut_start = history.find("Future Payments:")
            print(history[:fut_start - 1])
            print(history[:fut_start + len("Future Payments:")])
            if fut_start < 0:
                # No subscription yet
                return JsonResponse({"Previous payments": "None",
                                     "Future installments": "None"}, status=status.HTTP_200_OK)

            else:

                # Case where the subscription has been deleted
                if len(history) < fut_start + len("Future Payments:") + 2:
                    assert(member.subscription is None)
                    return JsonResponse({"Previous payments": history[:fut_start - 1],
                                         "Future installments": "None"}, status=status.HTTP_200_OK)

                fut_end = fut_start + len("Future Payments:")
                past = history[:fut_start - 1]

                future = history[fut_end:]

                check_arr = future.split(",")
                # print(check_arr)
                return JsonResponse({"Previous payments": past,
                                     "Future installments": future}, status=status.HTTP_200_OK)



########################################################################################################################
# CREDIT VIEW
########################################################################################################################

class CreditView(APIView):
    """
    List all snippets, or create a new snippet.
    """

    def get(self, request, format=None):
        if not request.user.is_authenticated:
            return JsonResponse({"Error": "Please sign in."}, status=status.HTTP_401_UNAUTHORIZED)
        member = Member.objects.filter(user=request.user.id)[0]
        # sub = member.subscription

        return JsonResponse({"credit_card": member.credit_card}, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        if not request.user.is_authenticated:
            return JsonResponse({"Error": "Please sign in."}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = CreditSerializer(data=request.data)
        member = Member.objects.filter(user=request.user.id)[0]

        if serializer.is_valid():
            member.credit_card = request.data["credit_card"]
            member.save()
            return Response({'successfully updated credit card'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

