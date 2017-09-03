An attempt to create a basic liquid simulation using cellular-autonoma like rules

Rules:
- Cells have 3 states: background (0), wall (1), and liquid (2)
- Only liquid cells have rules applied to them
- A liquid cells rules per generation happens like this:
  + If a cell has a BG cell below it, move there, if not, look at next statement
  + If a cell has both south east and south west BG cells, pick a random one and move there, if not, look at next statement
  + If a cell has either a south east or south west BG cell, move there, if not, look at next statement
  + If a cell has both east and west BG cells, pick a random one and move there, if not, look at next statement
  + If a cell has either an east BG cell or west BG cell, move there, if not, look at next statement
  + Do nothing
