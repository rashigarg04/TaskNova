from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.conf import settings
import os
import firebase_admin
from firebase_admin import credentials, auth
from .models import Task, Notification
from .serializers import TaskSerializer, NotificationSerializer

# Initialize Firebase (only once)
if not firebase_admin._apps:
    cred_path = os.path.join(settings.BASE_DIR, "firebase-key.json")
    cred = credentials.Certificate(cred_path)  # डाउनलोड from Firebase
    firebase_admin.initialize_app(cred)


@api_view(['POST'])
def firebase_auth(request):
    try:
        # Get token from frontend
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return Response({"error": "No token provided"}, status=401)

        token = auth_header.split(" ")[1]

        # Verify token
        decoded_token = auth.verify_id_token(token)

        uid = decoded_token['uid']
        email = decoded_token.get('email')

        return Response({
            "message": "User authenticated",
            "uid": uid,
            "email": email
        })

    except Exception as e:
        return Response({"error": str(e)}, status=401)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer