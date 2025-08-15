from budget import Budget
from transactions import Transactions
from utils.helpers import clear_screen, pause
import json
import os

DATA_FILE = "data/budget_data.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"budget": 0, "transactions": []}
    with open(DATA_FILE, "r") as file:
        return json.load(file)

def save_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

def main():
    clear_screen()
    print("💰 Welcome to Budgetly!")
    data = load_data()
    budget = Budget(data["budget"])
    transactions = Transactions(data["transactions"])

    while True:
        clear_screen()
        print("=== Budgetly Menu ===")
        print("1. View Budget")
        print("2. Add Budget Amount")
        print("3. Add Transaction")
        print("4. View Transactions")
        print("5. Exit")

        choice = input("Select an option (1-5): ")

        if choice == "1":
            print(f"Current budget: ${budget.amount:.2f}")
            pause()

        elif choice == "2":
            try:
                amount = float(input("Enter amount to add to budget: "))
                budget.add(amount)
                print(f"Added ${amount:.2f} to budget.")
            except ValueError:
                print("Invalid input. Please enter a number.")
            pause()

        elif choice == "3":
            try:
                name = input("Enter transaction name: ")
                amount = float(input("Enter transaction amount: "))
                transactions.add(name, amount)
                budget.add(-amount)
                print(f"Transaction '{name}' of ${amount:.2f} added.")
            except ValueError:
                print("Invalid input. Please enter a number.")
            pause()

        elif choice == "4":
            txns = transactions.get_all()
            if not txns:
                print("No transactions recorded.")
            else:
                for idx, t in enumerate(txns, 1):
                    print(f"{idx}. {t['name']} - ${t['amount']:.2f}")
            pause()

        elif choice == "5":
            save_data({"budget": budget.amount, "transactions": transactions.get_all()})
            print("Goodbye!")
            break

        else:
            print("Invalid option.")
            pause()

if __name__ == "__main__":
    main()
