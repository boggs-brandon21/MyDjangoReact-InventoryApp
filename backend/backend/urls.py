from api.views import CreateUserView, MyTokenObtainPairView, RetrieveUserView
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
    path('api/user/register/', CreateUserView.as_view(), name="register"),
    path('api/users/<int:pk>/', RetrieveUserView.as_view(), name="retrieve-user"),
    path('api/token/', MyTokenObtainPairView.as_view(), name="get_token"),
    path('api/token/refresh', TokenRefreshView.as_view(), name="refresh"),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('api.urls'))
]
