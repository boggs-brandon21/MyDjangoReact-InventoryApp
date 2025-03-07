from django.urls import path
from . import views


# API setup
urlpatterns = [
    path('items/',views.ItemListCreate.as_view(), name="item-list"),
    path('items/item/<int:pk>/',views.ItemDetail.as_view(), name="item-list"),
    path('items/delete/<int:pk>/', views.ItemDelete.as_view(), name="delete-item"),
    path('ordersIn/', views.OrderListCreate.as_view(), name="order-list"),
    path('ordersIn/order/<int:pk>/', views.OrderListCreate.as_view(), name='order'),
    path('ordersOut/', views.OutOrderListCreate.as_view(), name="out-orders-list")
]


# Old
# urlpatterns = [
#     path('', views.home, name="home"),
#     path('login/', views.loginPage, name="login"),
#     path('logout/', views.logoutUser, name="logout"),
#     path('register/', views.registerPage, name="register"),
#     path('order/<str:invoiceNumber>/', views.viewOrder,  name="view-order"),
#     path('inventory/<str:pk>/', views.inventory, name="inventory"),
#     path('create-item/', views.createItem, name="create-item"),
#     path('update-item/<str:pk>/', views.updateItem, name="update-item"),
#     path('delete-item/<str:pk>/', views.deleteItem, name="delete-item"),
#     path('order-item/', views.createOrder, name="order-item")
# ]