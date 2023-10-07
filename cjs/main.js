const questions = [{
        id: 0,
        title: "Muhammad s.a.v.ni bobolarining ismi?",
        opts: ["Abdulloh", "Abdumutallib", "Abdu Tolib"],
        valid: 1,
        done: false
    },
    {
        id: 1,
        title: "Allohning neshta ismi bor?",
        opts: ["9", "99", "100"],
        valid: 1,
        done: false
    },
    {
        id: 2,
        title: "Jismoniy taraflama kim kuchli?",
        opts: ["Farishta", "Inson", "Farishta-jin"],
        valid: 0,
        done: false
    },
    {
        id: 3,
        title: "Farz namoziga chaqiruv nima deb ataladi?",
        opts: ["Sunnat", "Takbir", "Azon"],
        valid: 1,
        done: false
    },
    {
        id: 4,
        title: "Muhammad s.a.v.ni qaysi amakilari boqib olganlar?",
        opts: ["Abdumutallib", "Hamza", "Abu Tolib"],
        valid: 2,
        done: false
    },
    {
        id: 5,
        title: "Islom dinining ustuni nechta?",
        opts: ["5 ta", "3 ta", "4 ta"],
        valid: 0,
        done: false
    },
    {
        id: 6,
        title: "O'lim farishtasi?",
        opts: ["Azroyil", "Munkar va Nakir", "Jabroyil"],
        valid: 0,
        done: false
    },
    {
        id: 7,
        title: "Ohirgi zamon payg'ambari kim?",
        opts: ["Muso s.a.v", "Muhammad s.a.v", "Iso s.a.v"],
        valid: 1,
        done: false
    },
    {
        id: 8,
        title: "Muhammad s.a.v.ning qizlarini ismi?",
        opts: ["Omina", "Hadicha", "Fotima"],
        valid: 2,
        done: false
    },
    {
        id: 9,
        title: "Payg'ambarimizdan keyingi birinchi halifa?",
        opts: ["Umar", "Abu Bakr", "Usmon"],
        valid: 1,
        done: false
    }
];

const mouse = {
    x: 0,
    y: 0,
    _x: 0,
    _y: 0,
    updatePosition: function (_event) {
        this.x = _event.clientX - this._x;
        this.y = _event.clientY - this._y;
    },
    setOrigin: function (_event) {
        this._x = _event.offsetLeft + Math.floor(_event.offsetWidth / 2);
        this._y = _event.offsetTop + Math.floor(_event.offsetHeight / 2);
    },

    show: function () {
        return this.x + ", " + this.y
    }
};

var counter = 0;
var updateRate = 1;

var update = function (ev) {
    mouse.updatePosition(ev);
}

var isTimeToUpdate = function () {
    return counter++ % updateRate === 0;
}

const select = function (_name) {
    return document.querySelector(_name);
};

const optionEl = select("#options");
const nextBtn = select("#nextBtn");
const containerEl = select("#container");
const questionEl = select("#question");
const timeEl = select("#time");
const progressEl = select("#progress");
const statusEl = select("#status");
const shadowEl = select("#shadow");
const explosionEl = select("#explosion");
const btns = select("#btns");

var width = 350;
var end = false;
var x, y;

class Quiz {
    constructor(_quiz) {
        this.quiz = _quiz;
        this.index = -1;
    }

    next() {
        if (this.check()) {
            this.index += 1;
        } else {
            return true;
        }
        return this.quiz[this.index];
    }

    check() {
        return this.quiz[this.index + 1] ? true : false;
    }

    randomize() {
        this.quiz.sort(function () {
            return Math.random() - 0.5
        });
    }
}

mouse.setOrigin(containerEl);

containerEl.addEventListener("mousemove", function (_e) {
    if (isTimeToUpdate()) {
        update(_e);
    }
    shadowEl.style.transform = "rotateY(" + (-mouse.x * 0.06) + "deg) rotateX(" + mouse.y * 0.08 + "deg)";
    containerEl.style.transform = "rotateY(" + (-mouse.x * 0.06) + "deg) rotateX(" + mouse.y * 0.08 + "deg)";

});

containerEl.addEventListener("mouseout", function () {
    shadowEl.style.transform = "rotateY(" + (0) + "deg) rotateX(" + 0 + "deg)";
    containerEl.style.transform = "rotateY(" + (0) + "deg) rotateX(" + 0 + "deg)";
});

containerEl.addEventListener("touchmove", function (_e) {
    if (isTimeToUpdate()) {
        update(_e);
    }
    shadowEl.style.transform = "rotateY(" + (-mouse.x * 0.06) + "deg) rotateX(" + mouse.y * 0.08 + "deg)";
    containerEl.style.transform = "rotateY(" + (-mouse.x * 0.06) + "deg) rotateX(" + mouse.y * 0.08 + "deg)";

});

containerEl.addEventListener("touchend", function () {
    shadowEl.style.transform = "rotateY(" + (0) + "deg) rotateX(" + 0 + "deg)";
    containerEl.style.transform = "rotateY(" + (0) + "deg) rotateX(" + 0 + "deg)";
});

const quiz = new Quiz(questions);
quiz.randomize();

var interval;
next();

function next() {

    statusEl.style.opacity = 0;
    if (!end) {

        progressEl.style.animation = "start 10s linear";
        var time = 10;
        timeEl.innerText = time + "s";

        interval = setInterval(function () {
            if (time - 1 <= 0) {
                end = true;
                endQuiz();
                return clearInterval(interval);
            }
            timeEl.innerText = --time + "s";
        }, 1000);

        progressEl.addEventListener("animationend", function () {
            statusEl.style.opacity = 1;
            statusEl.setAttribute("class", "error");
            statusEl.innerText = "Vaqt Tugadi!";
            progressEl.style.opacity = 0;
            clearInterval(interval);
            endQuiz();
            end = true;
        });

        if (quiz.quiz[quiz.index + 1] && quiz.index != -1) {
            optionEl.style.animation = "move .8s linear";
            optionEl.addEventListener("animationend", function () {
                optionEl.style.animation = "";
            });
        }

        optionEl.innerHTML = "";
        const nextQuiz = quiz.next();
        nextBtn.disabled = true;
        nextBtn.style.cursor = "not-allowed";

        if (nextQuiz !== true) {

            var clicked = false;
            questionEl.innerText = nextQuiz.title;
            questionEl.title = nextQuiz.title;

            nextQuiz.opts.forEach(function (val, id) {
                var option = document.createElement("div");
                option.classList.add("option");
                option.innerText = (id + 1) + ". " + val;
                option.dataset.id = id;
                option.addEventListener("click", function (_e) {
                    clearInterval(interval);
                    progressEl.style.animation = "";

                    if (clicked !== true) {
                        _e.target.classList.remove("option");
                        _e.target.classList.add("option2");
                        nextBtn.disabled = false;
                        nextBtn.style.cursor = "pointer";
                        if (_e.target.dataset.id == nextQuiz.valid) {
                            makeExplosion();
                            quiz.quiz[nextQuiz.id].done = true;
                            _e.target.classList.add("valid");
                            statusEl.style.opacity = 1;
                            statusEl.setAttribute("class", "success");
                            statusEl.innerText = "To'g'ri javob!";
                        } else {
                            statusEl.style.opacity = 1;
                            statusEl.setAttribute("class", "error");
                            statusEl.innerText = "Noto'g'ri javob.";
                            _e.target.classList.add("invalid");
                        }
                    }
                    clicked = true;
                });
                optionEl.appendChild(option);
            });
        } else {
            end = true;
            endQuiz();
            statusEl.style.opacity = 0;
        }
    } else {
        statusEl.style.opacity = 1;
        statusEl.setAttribute("class", "error");
        statusEl.innerText = "Vaqt Tugadi!";
        end = true;
    }
}

function getRandom(min = 0, max = 2) {
    return Math.floor(Math.random() * (max - min) + min);
}

function makeExplosion() {
    var text = "";
    for (var i = 0; i < 60; i++) {
        text += "<div style='animation: down 8s linear; font-size: " + getRandom(17, 22) + "px; top: " + (Math.floor(Math.random() * (-innerHeight)) - 50) + "px; left: " + (Math.floor(Math.random() * innerWidth)) + "px;'>⭐</div>";
    }
    explosionEl.innerHTML = text;
}

function endQuiz() {
    clearInterval(interval);

    progressEl.style.animation = "";
    questionEl.innerHTML = "Natija:";
    statusEl.style.opacity = 0;
    statusEl.innerHTML = "Sahifani yangilang.";

    const res = ((100 / quiz.quiz.length) * (quiz.quiz.filter((val) => val.done === true).length));
    optionEl.innerHTML = `
    <div class="percent ${ res < 50 ? "error" : "success" }">
        ${ res }%
    </div>
    `;
    btns.innerHTML = `
    <p></p>
    <button class="next-btn" onclick="document.location.reload()" >
        Qaytadan
    </button>
    `;
}

nextBtn.addEventListener("click", next);
