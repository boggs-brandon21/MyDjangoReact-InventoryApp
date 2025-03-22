from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our ViewSets with it
router = DefaultRouter()
router.register(r'items', views.InventoryItemViewSet, basename='item')
router.register(r'ordersIn', views.IncomingOrderViewSet, basename='incoming-order')
router.register(r'ordersOut', views.OutgoingOrderViewSet, basename='outgoing-order')
router.register(r'conversations', views.ConversationViewSet, basename='conversation')
router.register(r'messages', views.MessageViewSet, basename='message')


# API setup
# Testing new routes
urlpatterns = [
    path('', include(router.urls))
]

# Old defined routes with generic views
# urlpatterns = [
#     path('items/',views.ItemListCreate.as_view(), name="item-list"),
#     path('items/item/<int:pk>/',views.ItemDetail.as_view(), name="item-list"),
#     path('items/delete/<int:pk>/', views.ItemDelete.as_view(), name="delete-item"),
#     path('ordersIn/', views.OrderListCreate.as_view(), name="order-list"),
#     path('ordersIn/order/<int:pk>/', views.OrderListCreate.as_view(), name='order'),
#     path('ordersOut/', views.OutOrderListCreate.as_view(), name="out-orders-list")
# ]
