# Drag & Drop

Drag & drop is a very common feature widely supported in applications and operating systems. While implementations for drag & drop exist in HTML5 and Angular Material they do not quite fit with the requirements of the Cookster application. This means in this case a bespoke solution is required.

## Cookster Drag Operations

A drag operation in Cookster involves the user using the mouse to directly edit an item in a cooking plan. Supported drag operations are:

- **New Resource Action**
  This drag operation gives the user an easy method of adding a new Resource Action to a Kitchen Resource. The header at the top of each resource lane in the Plan Editor has a resource icon on the left side. To create a new Resource Action to user simply drags the icon down into the resource lane below the header. The drag operation is configured to lock movement to the vertical access so only pointer movement up and down is recognised, the horizontal position of the pointer is ignored.
  When the pointer moves into the resource lane a Resource Action is displayed at the pointer position (note while the pointer position is within the resource lane header the resource action icon is displayed at the pointer location). The Resource Action is displayed as a wavy line across the resource lane with a Resource Action icon on the right end of the line. The name of the action, initialised as 'New Action' is displayed above the wavy line on the right side. The time of the Resource Action is displayed obove the wavy line on the left side. As the Resource Action is dragged up and down in the resource lane the time is updated to match the position of the Resource Action in the resource lane.
  When the user drops the Resource Action in the resource lane a New Resource Action dialog pops up containing a simple form that asks the user to enter a name for the action. If the user cancels this dialog then no changes are made to the plan. If a name is entered and saved then a new Resource Action is added to the plan as specified.
  If the user is finishes the drag operation by dropping outside the resource lane then nothing is changed in the plan.

- **Move Resource Action**
  Description here

- **Move Activity**
  Description here

- **Change Activity Duration**
  Description here

- **Clone Activity From Template**
  Description here

- **Move Plan End**
  Description here

## Drag Target

A drag target is an element in a component that acts as the start trigger for a drag operation when the user performs a _mousedown_ over the element.

## Drop Zone

## Drop Area
