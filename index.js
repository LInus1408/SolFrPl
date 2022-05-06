const objectProperty = {
    element: null,
    x: null,
    y: null,
    view: 'right',
    positions: []
}

function animate({timing, draw, duration}) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {

    let now = Date.now();

    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) {
      objectProperty.x = objectProperty.element.offsetLeft;
      objectProperty.y = objectProperty.element.offsetTop;
      timeFraction = 1;
    }

    let progress = timing(timeFraction);
    objectProperty.positions.push({x : objectProperty.element.offsetLeft, y : objectProperty.element.offsetLeft, time: now})
    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}


function moveToX(from, to, duration = 5000, speed = 2) {

  objectProperty.element.style.left = from + 'px';

  
  animate(
    {
    duration: duration,
    timing: function easeInOut(timeFraction){
      return timeFraction > 0.5 ? 4*Math.pow((timeFraction-1),3)+1 : 4*Math.pow(timeFraction,3);
    },
    draw: function(progress) {

      let speedFactorX1 = ((speed <= 1) || (speed > 9.9)) ? 0 : speed / 100;
      let speedFactorX2 = speedFactorX1 == 0 ? 0 : (progress > 0.5) ?  1 : 1 + speedFactorX1;
 
      objectProperty.element.style.left = (progress * speedFactorX2)  * to  + 'px';
    }
  });
}

function moveToY(from, to, duration = 5000, speed = 1) {

  objectProperty.element.style.top = from + 'px';
 
  animate(
    {
    duration: duration,
    timing: function easeInOut(timeFraction){
      return timeFraction > 0.5 ? 4*Math.pow((timeFraction-1),3)+1 : 4*Math.pow(timeFraction,3);
    },
    draw: function(progress) {

      let speedFactorX1 = ((speed <= 1) || (speed > 9.9)) ? 0 : speed / 100;
      let speedFactorX2 = speedFactorX1 == 0 ? 0 : (progress > 0.5) ?  1 : 1 + speedFactorX1;

      objectProperty.element.style.top = (progress * speedFactorX2) * to + 'px';
    }
  });

}

function moveToXY(fromX, toX, fromY, toY, duration = 5000, speed = 1) {

  moveToX(fromX, toX, duration, speed)
  moveToY(fromY, toY, duration, speed)
}

function turn(turnView = right) {
  if(turnView == 'right') {
  objectProperty.element.style.transform = 'rotate(0deg)';
  } else if(turnView == 'left') {
    objectProperty.element.style.transform = 'rotate(180deg)';
  } else if(turnView == 'top') {
    objectProperty.element.style.transform = 'rotate(270deg)';
  } else {
    objectProperty.element.style.transform = 'rotate(90deg)';
  }
  objectProperty.view = turnView;
}



class IndexedMap {

  constructor(members) {
    this.members = [];
  }

  set(key, value) {
    if(key && value) {
      return this.members.push({[key] : value})
    }
  }
  has(key) {
    for(let i = 0; i < this.members.length; i++) {
      if(Object.keys(this.members[i]) == key) {
        return true;
      }
    }
    return false;
  }
  hasIndex(index) {
    if(index > (this.members.length - 1) || index < 0) {
      return false;
    }
    return true;
  }
  get(key) {
    for(let i = 0; i < this.members.length; i++) {
      if(Object.keys(this.members[i]) == key) {
        return Object.values(this.members[i])[0];
      }
    }
    return null;
  }
  getByIndex(index) {
    if (this.members.length == 0) {
      return null;
    }
    if(index > this.members.length || index < 0) {
      return null
    } else {
      return this.members[1]
    }
  }
  remove(key) {
    for(let i = 0; i < this.members.length; i++) {
      if(Object.keys(this.members[i]) == key) {
        return this.members.splice(i, 1);;
      }
    }
  }
  size() {
  return this.members.length;
  }
  union(...maps) {
    maps.forEach(item => {
      item.members.forEach(value => {
        this.members.push(value)
      })
  })
  return this.members;
  }
  unique() {
    let arr = [];
    let map = new Map()
    this.members.forEach(item => {
       arr.push(Object.values(item))
    })
    return Array.from(new Set(arr.flat()));
  }

  uniqueKeys() {
    let arr = [];
    let map = new Map()
    this.members.forEach(item => {
       arr.push(Object.keys(item))
    })
    return Array.from(new Set(arr.flat()));
  }

  setTo(index, value) {
    return this.members.splice(index, 0, value);
  }

    removeAt(index, count = 1) {
      return this.members.splice(index, count);
  }
}