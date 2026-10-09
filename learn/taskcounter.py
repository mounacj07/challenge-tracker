no_of_tasks=int(input("How many tasks do you want to enter? "))

count=0

print("Enter 'completed' or 'incomplete' for your tasks")
for i in range(no_of_tasks):
    task=input("Task: ")
    if task.lower()=="completed":
        count+=1

print("No. of tasks completed: ", count)