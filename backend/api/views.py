from .models import InventoryItem, IncomingOrder, OutgoingOrder
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ItemSerializer, IncomingOrderSerializer, OutgoingOrderSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


# Create an item in InventoryItem
class ItemListCreate(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    # queryset = InventoryItem.objects.all()
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(addedBy=self.request.user)
        else:
            print(serializer.errors)
            
    def get_queryset(self):
        queryset = InventoryItem.objects.all()
        item_id = self.request.query_params.get('item_id')
        if item_id is not None:
            queryset = queryset.filter(id=item_id)
        return queryset
            
# Delete an InventoryItem
class ItemDelete(generics.DestroyAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    
    # def get_queryset(self):
    #     user = self.request.user
    #     return InventoryItem.objects.filter(createdBy=user)
    
# RUD of CRUD    
class ItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    
    
# Create an IncomingOrder
class OrderListCreate(generics.ListCreateAPIView):
    # queryset = IncomingOrder.objects.all()
    serializer_class = IncomingOrderSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(orderedBy=self.request.user)
        else:
            print(serializer.errors)
    
    def get_queryset(self):
        queryset = IncomingOrder.objects.all()
        item_id = self.request.query_params.get('item_id')
        if item_id:
            queryset = queryset.filter(id=item_id)
        return queryset
    
# Create an OutgoingOrder
class OutOrderListCreate(generics.ListCreateAPIView):
    queryset = OutgoingOrder.objects.all()
    serializer_class = OutgoingOrderSerializer
    permission_classes = [AllowAny]

# Create the user view
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()  # List of dif obj we are looking at to not dupe users
    serializer_class = UserSerializer  # Accept this data to make a new user
    permission_classes = [AllowAny]  # Who can actually call this? Anyone in this case
    
class RetrieveUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()  # List of dif obj we are looking at to not dupe users
    serializer_class = UserSerializer  # Accept this data to make a new user
    permission_classes = [AllowAny]  # Who can actually call this? Anyone in this case
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
 
# Old django only setup that doesn't use API
# def loginPage(request):
#     page = 'login'
    
#     if request.user.is_authenticated:
#         return redirect('home')
    
#     if request == 'POST':
#         username = request.POST.get('username').lower()
#         password = request.POST.get('password')
        
#         try:
#             user = User.objects.get(username=username)
#         except:
#             messages.error(request, "User does not exist!")
            
#         user = authenticate(request, username=username, password=password)
        
#         if user is not None:
#             login(request, user)
#             return redirect('home')
#         else:
#             messages.error(request, "Username or password does not exist.")
    
#     context={'page': page}
#     return render(request, 'inventory_app/login_register.html', context)

# def logoutUser(request):
#     logout(request)
#     return redirect('home')

# def registerPage(request):
#     form = UserCreationForm()
    
#     if request.method == 'POST':
#         form = UserCreationForm(request.POST)
#         if form.is_valid():
#             user = form.save(commit=False)
#             user.username = user.username.lower()
#             user.save()
#             login(request, user)
#             return redirect('home')
#         else:
#             messages.error(request, "An error occurred during registration.")
        
#     return render(request, 'inventory_app/login_register.html', {'form': form})

# def home(request):
#     q = request.GET.get('q')
    
#     items = InventoryItem.objects.filter(incoming_orders__item=q)
    
#     orders = IncomingOrder.objects.all()
    
#     context = {'items':items, 'orders': orders}
#     return render(request, 'inventory_app/home.html', context)

# def register(request):
#     return render(request, 'inventory_app/register.html')

# def inventory(request, pk):
#     item = InventoryItem.objects.get(id=pk)
#     context = {'item': item}
#     return render(request, 'inventory_app/inventory.html', context)

# @login_required(login_url='login')
# def createItem(request):
#     form = ItemForm
#     if request.method == 'POST':
#         form = ItemForm(request.POST)
#         if form.is_valid():
#             form.save()
#             return redirect('home')
#     context = {'form': form}
#     return render(request, 'inventory_app/item_form.html', context)

# @login_required(login_url='login')
# def updateItem(request, pk):
#     item = InventoryItem.objects.get(id=pk)
#     form = ItemForm(instance=item)
    
    
#     if request.method == 'POST':
#         form = ItemForm(request.POST, instance=item)
#         if form.is_valid():
#             form.save()
#             return redirect('home')
    
#     context = {'form': form}
#     return render(request, 'inventory_app/item_form.html', context)

# @login_required(login_url='login')
# def deleteItem(request, pk):
#     item = InventoryItem.objects.get(id=pk)
    
#     if request.method == 'POST':
#         item.delete()
#         return redirect('home')
#     return render(request, 'inventory_app/delete.html', {'obj':item})

# @login_required(login_url='login')
# def viewOrder(request, invoiceNumber):
#     order = IncomingOrder.objects.get(invoiceNumber=invoiceNumber)
#     context = {'order': order}
#     return render(request, 'inventory_app/order_form.html', context)

# @login_required(login_url='login')
# def createOrder(request):
#     order_form = IncomingOrderForm
#     if request.method == 'POST':
#         order_form = IncomingOrderForm(request.POST)
#         if order_form.is_valid():
#             order_form.save()
#             return redirect('home')
#     context = {'order_form': order_form}
#     return render(request, 'inventory_app/order_form.html', context)
