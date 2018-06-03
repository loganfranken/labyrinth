const Direction = {
  Left: 0,
  Right: 1,
  Top: 2,
  Bottom: 3
};

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

const gridSize = 3;

const tileHeight = (canvasHeight/gridSize);
const tileWidth = (canvasWidth/gridSize);

const lineWidth = tileWidth * 0.8;

while(true)
{
  // Initialize the grid
  let grid = [];

  for(let y = 0; y < gridSize; y++)
  {
    grid[y] = new Array(gridSize);
  }

  // Draw the grid
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.beginPath();

  let x = 0;
  let y = 0;
  while(true)
  {
    // Draw the line
    let middleX = (x * tileWidth) + (tileWidth/2);
    let middleY = (y * tileHeight) + (tileHeight/2);
    context.lineTo(middleX, middleY);
    context.moveTo(middleX, middleY);

    grid[y][x] = true;

    let hasFoundPath = false;
    getRandomDirectionList().forEach((direction) => {

      if(hasFoundPath)
      {
        return;
      }

      switch(direction)
      {
        case Direction.Top:
          if(x > 0 && !grid[y][x - 1])
          {
            x = x - 1;
            hasFoundPath = true;
            return;
          }

        case Direction.Bottom:
          if(x < (gridSize - 1) && !grid[y][x + 1])
          {
            x = x + 1;
            hasFoundPath = true;
            return;
          }

        case Direction.Left:
          if(y < (gridSize - 1) && !grid[y + 1][x])
          {
            y = y + 1;
            hasFoundPath = true;
            return;
          }

        case Direction.Right:
          if(y > 0 && !grid[y - 1][x])
          {
            y = y - 1;
            hasFoundPath = true;
            return;
          }
      }

    });

    if(hasFoundPath)
    {
      continue;
    }

    if(!hasFoundPath)
    {
      break;
    }

  }

  // Calculate coverage
  let tileCount = 0;
  for(let y = 0; y < gridSize; y++)
  {
    for(let x = 0; x < gridSize; x++)
    {
      if(grid[y][x])
      {
        tileCount++;
      }
    }
  }

  if((tileCount / (gridSize * gridSize)) === 1)
  {
    break;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
}

function getRandomDirectionList()
{
  return shuffle([
    Direction.Left,
    Direction.Right,
    Direction.Top,
    Direction.Bottom
  ]);
}

// Source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a)
{
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

context.stroke();
