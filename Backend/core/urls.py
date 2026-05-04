from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve
from django.conf import settings
import os

urlpatterns = [
    path('api/', include('api.urls')),
    
    # Specific asset directories
    re_path(r'^css/(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR.parent, 'Frontend', 'css')}),
    re_path(r'^js/(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR.parent, 'Frontend', 'js')}),
    re_path(r'^img/(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR.parent, 'Frontend', 'img')}),
    
    # Default to public directory
    path('', lambda r: serve(r, 'index.html', document_root=os.path.join(settings.BASE_DIR.parent, 'Frontend', 'public'))),
    re_path(r'^(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR.parent, 'Frontend', 'public')}),
]