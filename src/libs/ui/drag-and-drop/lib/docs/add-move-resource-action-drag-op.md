# Adding New Drag Operation

These notes capture steps taken to implement the Move Resource Action drag operation.

## Add Drag Operation Class

Name _DragMoveResourceAction_.

In _ResourceActionTile_ component create a computed signal that emits an instance of _DragMoveResourceAction_. Add the CkDrag directive to the wave \<dir>.
