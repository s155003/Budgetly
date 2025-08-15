class Transactions:
    def __init__(self, transactions=None):
        if transactions is None:
            transactions = []
        self.transactions = transactions

    def add(self, name, amount):
        self.transactions.append({"name": name, "amount": amount})

    def get_all(self):
        return self.transactions
