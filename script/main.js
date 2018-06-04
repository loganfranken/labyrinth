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

const sectionSize = 5;
const gridSize = 15;

buildLabyrinth();

function buildLabyrinth()
{
  const tileHeight = (canvasHeight/gridSize);
  const tileWidth = (canvasWidth/gridSize);

  const sectionCount = (gridSize/sectionSize);

  let route = null;
  let startX = 0;
  let startY = 0;
  let sectionX = null;
  let sectionY = null;

  // 000
  // 0X0
  // 000
  sectionX = 1;
  sectionY = 1;
  route = getLabyrinthRoute({ x: Math.floor(sectionSize/2), y: Math.floor(sectionSize/2) }, sectionSize);
  drawLabyrinthRoute(route, sectionSize, tileWidth, tileHeight, { x: (sectionX * sectionSize * tileWidth), y: (sectionY * sectionSize * tileHeight) });

  // 000
  // 00X
  // 000
  sectionX = 2;
  sectionY = 1;
  route = getLabyrinthRoute({ x: startX, y: startY }, sectionSize);
  drawLabyrinthRoute(route, sectionSize, tileWidth, tileHeight, { x: (sectionX * sectionSize * tileWidth), y: (sectionY * sectionSize * tileHeight) });

  // 000
  // 000
  // 00X
  sectionX = 2;
  sectionY = 2;
  route = getLabyrinthRoute({ x: startX, y: startY }, sectionSize);
  drawLabyrinthRoute(route, sectionSize, tileWidth, tileHeight, { x: (sectionX * sectionSize * tileWidth), y: (sectionY * sectionSize * tileHeight) });

  // 000
  // 000
  // 0X0
  sectionX = 1;
  sectionY = 2;
  route = getLabyrinthRoute({ x: startX, y: startY }, sectionSize);
  drawLabyrinthRoute(route, sectionSize, tileWidth, tileHeight, { x: (sectionX * sectionSize * tileWidth), y: (sectionY * sectionSize * tileHeight) });

  // 000
  // 000
  // X00
  sectionX = 0;
  sectionY = 2;
  route = getLabyrinthRoute({ x: startX, y: startY }, sectionSize);
  drawLabyrinthRoute(route, sectionSize, tileWidth, tileHeight, { x: (sectionX * sectionSize * tileWidth), y: (sectionY * sectionSize * tileHeight) });

  // 000
  // X00
  // 000
  sectionX = 0;
  sectionY = 1;
  route = getLabyrinthRoute({ x: startX, y: startY }, sectionSize);
  drawLabyrinthRoute(route, sectionSize, tileWidth, tileHeight, { x: (sectionX * sectionSize * tileWidth), y: (sectionY * sectionSize * tileHeight) });

  // X00
  // 000
  // 000
  sectionX = 0;
  sectionY = 0;
  route = getLabyrinthRoute({ x: startX, y: startY }, sectionSize);
  drawLabyrinthRoute(route, sectionSize, tileWidth, tileHeight, { x: (sectionX * sectionSize * tileWidth), y: (sectionY * sectionSize * tileHeight) });

  // 0X0
  // 000
  // 000
  sectionX = 1;
  sectionY = 0;
  route = getLabyrinthRoute({ x: startX, y: startY }, sectionSize);
  drawLabyrinthRoute(route, sectionSize, tileWidth, tileHeight, { x: (sectionX * sectionSize * tileWidth), y: (sectionY * sectionSize * tileHeight) });

  // 00X
  // 000
  // 000
  sectionX = 2;
  sectionY = 0;
  route = getLabyrinthRoute({ x: startX, y: startY }, sectionSize);
  drawLabyrinthRoute(route, sectionSize, tileWidth, tileHeight, { x: (sectionX * sectionSize * tileWidth), y: (sectionY * sectionSize * tileHeight) });
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

    // Did we cover the entire grid?
    if(currTileIndex >= totalTileCount)
    {
      return grid;
    }
  }
}

function drawLabyrinthRoute(route, gridSize, tileWidth, tileHeight, position)
{
  context.lineWidth = tileWidth * 0.8;
  context.lineCap = 'round';
  context.strokeStyle = '#ccc';
  context.beginPath();

  const startCoords = locateRouteStartCoords(route);

  let nextTileIndex = 0;
  let x = startCoords.x;
  let y = startCoords.y;

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

function locateRouteStartCoords(route)
{
  for(let y = 0; y < route.length; y++)
  {
    for(let x = 0; x < route[y].length; x++)
    {
      if(route[y][x] === 0)
      {
        return { x, y };
      }
    }
  }
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
