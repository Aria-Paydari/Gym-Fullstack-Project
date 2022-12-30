########################################################################################################################
# IMPORTS
########################################################################################################################
from datetime import datetime, timedelta
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.models import Member
from subs.models import Subscription
from subs.serializers import SubscriptionSerializer


########################################################################################################################
# ADD SUBSCRIPTION MODEL
########################################################################################################################
class AddSubscription(APIView):
    """
    List all snippets, or create a new snippet.
    """

    def get(self, request, format=None):
        # if not (request.user.is_authenticated or request.user.is_superuser):
        #     return Response(status=status.HTTP_401_UNAUTHORIZED)
        subs = Subscription.objects.all()
        serializer = SubscriptionSerializer(subs, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = SubscriptionSerializer(data=request.data)
        # print(request.data["plan"])
        if serializer.is_valid():
            member = Member.objects.filter(user=request.user.id)[0]

            check = Subscription.objects.filter(plan=request.data["plan"], amount=request.data["amount"])
            if not check:
                return JsonResponse({"Error": "The subscription is invalid."}, status=status.HTTP_400_BAD_REQUEST)
            sub = check[0]
            sub.save()
            if member.subscription is None:
                history = member.payment_history
                if len(history) == 0:

                    date = datetime.now()
                    mod_date = []
                    mod_date.append(str(date.year) + "-" + str(date.month) + "-" + str(date.day) + "|" + str(
                        date.hour) + ":" + str(date.minute) + "|$" + str(sub.amount) + "|" + member.credit_card)
                    mod_date.append("Future Payments:")

                    interval_days = 0
                    if sub.plan == 'Weekly':
                        interval_days = 7
                    elif sub.plan == 'Biweekly':
                        interval_days = 14
                    elif sub.plan == 'Monthly':
                        interval_days = 31
                    elif sub.plan == 'Yearly':
                        interval_days = 365

                    for i in range(1, 51):
                        time_change = timedelta(days=(interval_days * i))
                        new_time = date + time_change
                        mod_date.append(str(new_time.year) + "-" + str(
                            new_time.month) + "-" + str(new_time.day) + "|" + str(
                            new_time.hour) + ":" + str(new_time.minute) + "|$" + str(sub.amount))

                    member.payment_history =(",".join(mod_date))

                else:
                    # deleted
                    date = datetime.now()
                    mod_date = []
                    fut_start = history.find("Future Payments:")
                    mod_date.append(history[:fut_start -1])
                    mod_date.append(
                        str(date.year) + "-" + str(date.month) + "-" + str(date.day) + "|" + str(
                            date.hour) + ":" + str(date.minute) + "|$" + str(
                            sub.amount) + "|" + member.credit_card)
                    mod_date.append("Future Payments:")

                    interval_days = 0
                    if sub.plan == 'Weekly':
                        interval_days = 7
                    elif sub.plan == 'Biweekly':
                        interval_days = 14
                    elif sub.plan == 'Monthly':
                        interval_days = 31
                    elif sub.plan == 'Yearly':
                        interval_days = 365

                    for i in range(1, 51):
                        time_change = timedelta(days=(interval_days * i))
                        new_time = date + time_change
                        mod_date.append(str(new_time.year) + "-" + str(
                            new_time.month) + "-" + str(new_time.day) + "|" + str(
                            new_time.hour) + ":" + str(new_time.minute) + "|$" + str(sub.amount))

                    member.payment_history = (",".join(mod_date))

            else:
                history = member.payment_history
                date = datetime.now()
                fut_start = history.find("Future Payments:")
                past = history[:fut_start]
                past = past +str(date.year) + "-" + str(date.month) + "-" + str(
                    date.day) + "|" + str(
                    date.hour) + ":" + str(date.minute) + "|$" + str(
                    sub.amount) + "|" + member.credit_card + ",Future Payments:"
                mod_date = []

                interval_days = 0
                if sub.plan == 'Weekly':
                    interval_days = 7
                elif sub.plan == 'Biweekly':
                    interval_days = 14
                elif sub.plan == 'Monthly':
                    interval_days = 31
                elif sub.plan == 'Yearly':
                    interval_days = 365

                for i in range(1, 51):
                    time_change = timedelta(days=(interval_days * i))
                    new_time = date + time_change
                    mod_date.append(str(new_time.year) + "-" + str(
                        new_time.month) + "-" + str(new_time.day) + "|" + str(
                        new_time.hour) + ":" + str(new_time.minute) + "|$" + str(sub.amount))

                new_payments = past + ",".join(mod_date)
                member.payment_history = new_payments


            member.subscription = sub
            member.save()
            # return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'successfully updated subscription'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        if request.user.is_authenticated:
            member = Member.objects.get(user=request.user)

            if member.subscription is None:
                return Response("no subscription found", status=status.HTTP_400_BAD_REQUEST)

            member.subscription = None

            history = member.payment_history
            fut_start = history.find("Future Payments:")
            past = history[:fut_start + len("Future Payments:")]
            # fut_start += len("Future Payments:")

            member.payment_history = past
            member.subscription = None
            member.save()
            return Response("successfully deleted subscription", status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class MySubscription(APIView):
    """
    List all snippets, or create a new snippet.
    """

    def get(self, request, format=None):
        if not (request.user.is_authenticated or request.user.is_superuser):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        member = Member.objects.get(user=request.user)

        if member.subscription is None:
            return JsonResponse({"Membership": "You do not currently have a subscription."})
        else:
            return JsonResponse({"Amount": member.subscription.amount, "Plan":member.subscription.plan})
