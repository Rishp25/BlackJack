from django.contrib import admin
from .models import *

# Register your models here.
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'password', 'numberOfChips', 'turn')

class TableAdmin(admin.ModelAdmin):
    list_display = ('id', 'createdBy', 'numberOfPlayers', 'players')    

class CardAdmin(admin.ModelAdmin):
    list_display = ('id', 'suit', 'value')  

class DeckAdmin(admin.ModelAdmin):
    list_display = ('id', 'cards')   

class RoundAdmin(admin.ModelAdmin):
    list_display = ('id', 'deck', 'table', 'player', 'bet', 'hit', 'stand', 'double', 'split', 'bust', 'win')               

admin.site.register(Player, PlayerAdmin)
admin.site.register(Table, TableAdmin)
admin.site.register(Card, CardAdmin)
admin.site.register(Deck, DeckAdmin)
admin.site.register(Round, RoundAdmin)