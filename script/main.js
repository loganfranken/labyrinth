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

buildLabyrinth();

function buildLabyrinth()
{
  const sectionSize = 5;
  const gridSize = 15;

  const tileHeight = (canvasHeight/gridSize);
  const tileWidth = (canvasWidth/gridSize);

  const sectionCount = (gridSize/sectionSize);

  let route = null;
  let startX = 0;
  let startY = 0;
  let sectionX = 1;
  let sectionY = 1;

  while(true)
  {
    routeInfo = getLabyrinthRoute({ x: Math.floor(sectionSize/2), y: Math.floor(sectionSize/2) }, sectionSize);
    drawLabyrinthRoute(routeInfo, sectionSize, tileWidth, tileHeight, { x: (sectionX * sectionSize * tileWidth), y: (sectionY * sectionSize * tileHeight) });

    // 000
    // 0X0
    // 000
    if(sectionX === 1 && sectionY === 1)
    {
      sectionX = 2;
      continue;
    }

    // 000
    // 00X
    // 000
    if(sectionX === 2 && sectionY === 1)
    {
      sectionY = 2;
      continue;
    }

    // 000
    // 000
    // 00X
    if(sectionX === 2 && sectionY === 2)
    {
      sectionX = 1;
      continue;
    }

    // 000
    // 000
    // 0X0
    if(sectionX === 1 && sectionY === 2)
    {
      sectionX = 0;
      continue;
    }

    // 000
    // 000
    // X00
    if(sectionX === 0 && sectionY === 2)
    {
      sectionY = 1;
      continue;
    }

    // 000
    // X00
    // 000
    if(sectionX === 0 && sectionY === 1)
    {
      sectionY = 0;
      continue;
    }

    // X00
    // 000
    // 000
    if(sectionX === 0 && sectionY === 0)
    {
      sectionX = 1;
      continue;
    }

    // 0X0
    // 000
    // 000
    if(sectionX === 1 && sectionY === 0)
    {
      sectionX = 2;
      continue;
    }

    // 00X
    // 000
    // 000
    if(sectionX === 2 && sectionY === 0)
    {
      break;
    }
  }
}

function getLabyrinthRoute(startCoords, gridSize)
{
  const totalTileCount = (gridSize * gridSize);
  while(true)
  {
    // Initialize the grid
    let grid = [];

    for(let y = 0; y < gridSize; y++)
    {
      grid[y] = new Array(gridSize);
    }

    let currTileIndex = 0;
    let x = startCoords.x;
    let y = startCoords.y;

    while(true)
    {
      grid[y][x] = currTileIndex;
      currTileIndex++;

      let hasFoundPath = false;

      getRandomDirectionList().forEach((direction) => {

        if(hasFoundPath)
        {
          return;
        }

        switch(direction)
        {
          case Direction.Top:
            if(x > 0 && typeof(grid[y][x - 1]) === 'undefined')
            {
              x = x - 1;
              hasFoundPath = true;
              return;
            }

          case Direction.Bottom:
            if(x < (gridSize - 1) && typeof(grid[y][x + 1]) === 'undefined')
            {
              x = x + 1;
              hasFoundPath = true;
              return;
            }

          case Direction.Left:
            if(y < (gridSize - 1) && typeof(grid[y + 1][x]) === 'undefined')
            {
              y = y + 1;
              hasFoundPath = true;
              return;
            }

          case Direction.Right:
            if(y > 0 && typeof(grid[y - 1][x]) === 'undefined')
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

    var isCovered = (currTileIndex >= totalTileCount);
    var hasReachedEdge = (x === 0 || x === (gridSize - 1) || y === 0 || y === (gridSize - 1));

    // Did we cover the entire grid?
    if(isCovered && hasReachedEdge)
    {
      return {
        grid,
        start: startCoords,
        end: { x, y }
      };
    }
  }
}

function drawLabyrinthRoute(routeInfo, gridSize, tileWidth, tileHeight, position)
{
  context.lineWidth = tileWidth * 0.8;
  context.lineCap = 'round';
  context.strokeStyle = '#ccc';
  context.beginPath();

  let nextTileIndex = 0;
  let route = routeInfo.grid;
  let x = routeInfo.start.x;
  let y = routeInfo.start.y;

  while(true)
  {
    nextTileIndex++;
    let middleX = ((x * tileWidth) + (tileWidth/2)) + position.x;
    let middleY = ((y * tileHeight) + (tileHeight/2)) + position.y;
    context.lineTo(middleX, middleY);
    context.moveTo(middleX, middleY);

    let hasFoundPath = false;

    getRandomDirectionList().forEach((direction) => {

      if(hasFoundPath)
      {
        return;
      }

      switch(direction)
      {
        case Direction.Top:
          if(x > 0 && route[y][x - 1] === nextTileIndex)
          {
            x = x - 1;
            hasFoundPath = true;
            return;
          }

        case Direction.Bottom:
          if(x < (gridSize - 1) && route[y][x + 1] === nextTileIndex)
          {
            x = x + 1;
            hasFoundPath = true;
            return;
          }

        case Direction.Left:
          if(y < (gridSize - 1) && route[y + 1][x] === nextTileIndex)
          {
            y = y + 1;
            hasFoundPath = true;
            return;
          }

        case Direction.Right:
          if(y > 0 && route[y - 1][x] === nextTileIndex)
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

  context.stroke();
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
