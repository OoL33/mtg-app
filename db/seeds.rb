# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
alana = User.create(email: "arcanevirgo@magicdeck.com", password: "secretlair")

deck_one = Deck.create(id: 1, name: "green deck", description: "only green cards", user_id: 1)