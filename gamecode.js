const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')

canvas.width = 40*11
canvas.height = innerHeight

class Boundry {
    constructor({ position, image }) { 
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.openrate = 0.06
        this.rotation = 0 
    }
    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 -this.radians)
        c.lineTo(this.position.x,this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.radians < 0 || this.radians > 0.75){
            this.openrate = - this.openrate
        }
        this.radians += this.openrate
    }
}

class Ghost {
    constructor({ position, velocity, color}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.scared = false
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Food {
    constructor({ position }) {
        this.position = position
        this.radius = 5
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

const foods = []

const boundries = []

const ghosts = [
    new Ghost({
        position: {
            x: 40 * 6 + 20,
            y: 60
        },
        velocity: {
            x: 1,
            y: 0
        },
        color: 'red'
    }),
    new Ghost({
        position: {
            x: 40 * 6 + 20,
            y: 40 * 3 + 20
        },
        velocity: {
            x: 1,
            y: 0
        },
        color: 'pink'
    }),
    new Ghost({
        position: {
            x: 40 * 6 + 20,
            y: 40 * 7 + 20
        },
        velocity: {
            x: 1,
            y: 0
        },
        color: 'blue'
    })
]

const player = new Player({
    position: {
        x: 40 + 20,
        y: 40 + 20
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastkey = ''

let score = 0

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', 'b', ' ', '[', 'T', ']', ' ', 'b', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', 'V', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', '[', ']', ' ', ' ', ' ', '[', ']', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', 'A', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', 'b', ' ', '[', 'x', ']', ' ', 'b', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', 'V', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', '[', ']', ' ', ' ', ' ', '[', ']', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', 'A', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', 'b', ' ', '[', 'U', ']', ' ', 'b', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

const totalFood = parseInt(prompt("Enter Total number of Food (max 72) : ")) || 5 


const initializeStack = () => {
    let stack = document.getElementById("stack")
    const createFood = (no) => {
        const food = document.createElement("div");
        food.classList = ["food"]
        food.style.height = 500/totalFood
        food.innerHTML= "Food " + no
        return food
    }
    for(let i=0; i<totalFood; i++){
        let food = createFood(i+1)
        stack.insertBefore(food, stack.children[0])
    }
}

initializeStack()


const totalFoodSpace = 72;
let foodCount = totalFood;
let foodInserted = 1;
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/pipeHorizontal.png')
                    }))
                break
            case '|':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/pipeVertical.png')
                    }))
                break
            case '1':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/pipeCorner1.png')
                    }))
                break
            case '2':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/pipeCorner2.png')
                    }))
                break
            case '3':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/pipeCorner3.png')
                    }))
                break
            case '4':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/pipeCorner4.png')
                    }))
                break
            case 'b':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/block.png')
                    }))
                break
            case '[':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/capLeft.png')
                    }))
                break
            case ']':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/capRight.png')
                    }))
                break
            case 'A':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/capTop.png')
                    }))
                break
            case 'V':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/capBottom.png')
                    }))
                break
            case 'x':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/pipeCross.png')
                    }))
                break
            case 'T':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/pipeConnectorBottom.png')
                    }))
                break
            case 'U':
                boundries.push(
                    new Boundry({
                        position: {
                            x: 40 * j,
                            y: 40 * i
                        },
                        image: createImage('./images/pipeConnectorTop.png')
                    }))
                break
            case ' ':
                if(foodCount != 0 && (foodInserted) % parseInt(totalFoodSpace/totalFood) == 0 ){
                    foods.push(
                        new Food({
                            position: {
                                x: 40 * j + 20,
                                y: 40 * i + 20
                            }
                        })
                    )
                    foodCount--;
                }else{
                    console.log(foodInserted, (foodInserted) % parseInt(totalFoodSpace/foodCount), parseInt(totalFoodSpace/foodCount))
                }
                foodInserted++;
                break
        }
    })
})

function circlecollision({circle, rectangle}) {
    const padding = 20 - circle.radius - 1
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)

}

let animationId

function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    if (keys.w.pressed && lastkey === 'w') {
        for (let i = 0; i < boundries.length; i++) {
            const boundry = boundries[i]
            if (circlecollision({
                circle: {
                    ...player, velocity: {
                        x: 0, y: -2
                    }
                },
                rectangle: boundry
            })) {
                player.velocity.y = 0
                break
            }
            else {
                player.velocity.y = -2
            }
        }

    }
    else if (keys.a.pressed && lastkey === 'a') {
        for (let i = 0; i < boundries.length; i++) {
            const boundry = boundries[i]
            if (circlecollision({
                circle: {
                    ...player, velocity: {
                        x: -2, y: 0
                    }
                },
                rectangle: boundry
            })) {
                player.velocity.x = 0
                break
            }
            else {
                player.velocity.x = -2
            }
        }
    }
    else if (keys.s.pressed && lastkey === 's') {
        for (let i = 0; i < boundries.length; i++) {
            const boundry = boundries[i]
            if (circlecollision({
                circle: {
                    ...player, velocity: {
                        x: 0, y: 2
                    }
                },
                rectangle: boundry
            })) {
                player.velocity.y = 0
                break
            }
            else {
                player.velocity.y = 2
            }
        }
    }
    else if (keys.d.pressed && lastkey === 'd') {
        for (let i = 0; i < boundries.length; i++) {
            const boundry = boundries[i]
            if (circlecollision({
                circle: {
                    ...player, velocity: {
                        x: 2, y: 0
                    }
                },
                rectangle: boundry
            })) {
                player.velocity.x = 0
                break
            }
            else {
                player.velocity.x = 2
            }
        }
    }

    
    for (let i = ghosts.length - 1; i >= 0; i--) {
        const ghost = ghosts[i]
        if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius) {
            cancelAnimationFrame(animationId)

            console.log('You Lose!')
            if (confirm("😔You Lose\nGame Over, Play again")) {
                txt = "Restart";
                window.location.reload()
            }  
        }
    }

    if(foods.length === 0){
        console.log('You Win!!!')
        cancelAnimationFrame(animationId)
        if (confirm("🏆You Win!!!\nGame Over, Play again")) {
            txt = "Restart";
            window.location.reload()
        }  
    }   

    const updateFoodStack = () =>{
        let stack = document.getElementById("stack")
        stack.removeChild(stack.firstElementChild)
    }

    for (let i = foods.length - 1; i >= 0; i--) {
        const food = foods[i]
        food.draw()
        if (Math.hypot(food.position.x - player.position.x, food.position.y - player.position.y) < food.radius + player.radius) {
            foods.splice(i, 1)
            updateFoodStack()
            score += 10
            scoreEl.innerHTML = score
        }
    }


    boundries.forEach((boundry) => {
        boundry.draw()
        if (circlecollision({
            circle: player,
            rectangle: boundry
        })) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }

    })

    player.update()
    ghosts.forEach(ghost => {
        ghost.update()

        const collisions = []
        boundries.forEach(boundry => {
            if (!collisions.includes('right') && circlecollision({
                circle: {
                    ...ghost, velocity: {
                        x: 1, y: 0
                    }
                },
                rectangle: boundry
            })) {
                collisions.push('right')
            }

            if (!collisions.includes('left') && circlecollision({
                circle: {
                    ...ghost, velocity: {
                        x: -1, y: 0
                    }
                },
                rectangle: boundry
            })) {
                collisions.push('left')
            }

            if (!collisions.includes('up') && circlecollision({
                circle: {
                    ...ghost, velocity: {
                        x: 0, y: -1
                    }
                },
                rectangle: boundry
            })) {
                collisions.push('up')
            }

            if (!collisions.includes('down') && circlecollision({
                circle: {
                    ...ghost, velocity: {
                        x: 0, y: 1
                    }
                },
                rectangle: boundry
            })) {
                collisions.push('down')
            }
        })

        if (collisions.length > ghost.prevCollisions.length)
            ghost.prevCollisions = collisions

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
            if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

            const pathways = ghost.prevCollisions.filter(collision => {
                return !collisions.includes(collision)
            })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            switch (direction) {
                case 'down':
                    ghost.velocity.y = 1
                    ghost.velocity.x = 0
                    break

                case 'up':
                    ghost.velocity.y = -1
                    ghost.velocity.x = 0
                    break

                case 'right':
                    ghost.velocity.y = 0
                    ghost.velocity.x = 1
                    break

                case 'left':
                    ghost.velocity.y = 0
                    ghost.velocity.x = -1
                    break
            }

            ghost.prevCollisions = []
        }
    })

    if(player.velocity.x > 0 ) player.rotation = 0
    else if(player.velocity.x < 0 ) player.rotation = Math.PI
    else if(player.velocity.y > 0 ) player.rotation = Math.PI/2 
    else if(player.velocity.y < 0 ) player.rotation = Math.PI * 1.5 

}

animate()

window.addEventListener('keydown', ({ key }) => {

    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastkey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastkey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastkey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastkey = 'd'
            break
    }
})


window.addEventListener('keyup', ({ key }) => {
        switch (key) {
            case 'w':
                keys.w.pressed = false
                break
            case 'a':
                keys.a.pressed = false
                break
            case 's':
                keys.s.pressed = false
                break
            case 'd':
                keys.d.pressed = false
                break
        }
    }
)

