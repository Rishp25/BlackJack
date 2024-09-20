from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializer import *
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.hashers import make_password,check_password
from django.conf import settings
from django.db import transaction

# Create your views here.
class Hello(APIView):
    def get(self, request, format=None):
        return Response({
            'message': 'Hello, World!',
        })
    
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = PlayerSignupSerializer(data=request.data)
        if serializer.is_valid():
            try:
                player = Player.objects.filter(name=serializer.validated_data.get('name')).first()
                if player:
                    return Response({
                        'status' : 409,
                        'message': 'Player already exists',
                    })
                else:
                    serializer.save()
                    return Response({
                        'status': 200,
                        'message': 'Player successfully Created',
                    })
            except Exception as e:
                return Response({
                    'status': 500,
                    'message': 'Error while creating player',
                    'error': str(e)
                })
        else:
            print(serializer.error_messages)
            return Response({
                'status': 406,
                'message': serializer.errors['password'][0]
            })

class SinginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = PlayerSigninSerializer(data=request.data)
        if serializer.is_valid():
            try:
                player = Player.objects.filter(name=serializer.validated_data.get('name')).first()
                if player:
                    if serializer.validated_data.get('password') != player.password:
                        return Response({
                            'status': 401,
                            'message': 'Incorrect Password'
                        })

                    return Response({
                        'status' : 200,
                        'message': 'Successfully LoggedIn',
                    })
                else:
                    return Response({
                        'status': 406,
                        'message': 'Invalid Credentials',
                    })

            except Exception as e:
                return Response({
                    'status': 500,
                    'message': 'Error while creating player',
                    'error': str(e)
                })
        else:
            print(serializer.error_messages)
            return Response({
                'status': 406,
                'message': serializer.errors['password'][0]
            })

class CreateTableView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = CreateTableSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response({
                        'status': 200,
                        'message': 'Table successfully Created',
                })
            
            except Exception as e:
                return Response({
                    'status': 500,
                    'message': 'Error while creating table',
                    'error': str(e)
                })
        else:
            print(serializer.error_messages)
            return Response({
                'status': 406,
                'message': "Error while serializing"
            })
        
class CreateDeckView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        try:
            # Extract card data from the request body
            cards_data = request.data.get('cards', [])
            
            if not cards_data:
                return Response({
                    'status': 400,
                    'message': 'No cards provided.'
                })
            
            # Validate cards data
            if not isinstance(cards_data, list):
                return Response({
                    'status': 400,
                    'message': 'Cards data should be a list.'
                })
            
            # Start a database transaction
            with transaction.atomic():
                # Create a new deck
                deck = Deck.objects.create()
                
                # Create cards and associate them with the deck
                for card_data in cards_data:
                    suit = card_data.get('suit')
                    value = card_data.get('value')
                    
                    if not suit or not value:
                        return Response({
                            'status': 400,
                            'message': 'Each card must have a suit and value.'
                        })
                    
                    # Create a card and associate it with the deck
                    card = Card.objects.create(suit=suit, value=value)
                    deck.cards.add(card)
                
                return Response({
                    'status': 200,
                    'message': 'Deck created successfully.'
                })
        
        except Exception as e:
            return Response({
                'status': 500,
                'message': f'An error occurred: {str(e)}'
            })