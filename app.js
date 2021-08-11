let graphics__scale = document.querySelector('.graphics__scale');
let graphic = document.querySelector('.graphics');
class Voter {
    constructor(options) {
        this.field = options.field;
        this.elem = this.field.parentElement;
        this.increaseButton = this.elem.querySelector('.plus.btn');
        this.decreaseButton = this.elem.querySelector('.minus.btn');
        this.step = options.step;
        this.min = options.min;
        this.max = options.max;
        this.elem.addEventListener('click', (el) => {
            if (el.target === this.increaseButton) {
                this.increase();
                graphics__scale.innerHTML = ' ';
                graphics_initialization();

            } else if (el.target === this.decreaseButton) {
                this.decrease();
                graphics__scale.innerHTML = ' ';
                graphics_initialization();

            }
        });
    }

    increase() {
        if (parseInt(this.field.value) !== this.max) {
            this.field.value = parseInt(this.field.value) + this.step;
        }
    }

    decrease() {
        if (parseInt(this.field.value) !== this.min) {
            this.field.value = parseInt(this.field.value) - this.step;
        }
    }

}

const work_times = new Voter({
    step: 5,
    field: document.getElementById('work-time'),
    min: 10,
    max: 25,
});
const work_iterations = new Voter({
    step: 1,
    field: document.getElementById('work-iteration'),
    min: 2,
    max: 6,
});
const short_breaks = new Voter({
    step: 1,
    field: document.getElementById('short-break'),
    min: 2,
    max: 5,
});
const long_breaks = new Voter({
    step: 5,
    field: document.getElementById('long-break'),
    min: 10,
    max: 30,
});
const settings_default = {
    time: {
        work_time: work_times.field,
        work_iteration: work_iterations.field,
        long_break: long_breaks.field,
        short_break: short_breaks.field
    },
    set_default: function() {
        this.time.work_time.value = 25;
        this.time.work_iteration.value = 5;
        this.time.short_break.value = 5;
        this.time.long_break.value = 30;
    },
    get_time: function(name) {
        return this.time[`${name}`];
    },
    set_time: function(name, value) {
        this.time[`${name}`] = value;
    }
}

function graphics_draw(long_break, short_break, work_iteration, work_time) {

    let short_break_amount = (work_iteration - 1) * 2;
    let work_time_amount = work_iteration * 2;

    let short_break_total_time = short_break * short_break_amount;
    let work_total_time = work_time * work_time_amount;

    let total_time = short_break_total_time + work_total_time + long_break;

    let graphics_elem_length = function(total, elem) {
        let count = elem / total;
        return count;
    }

    let short_break_length = graphics_elem_length(total_time, short_break_amount);
    let work_time_length = graphics_elem_length(total_time, work_time);
    let long_break_length = graphics_elem_length(total_time, long_break);

    let tips = function() {

        let first_сicle_time = ((total_time - long_break) / 2 + long_break);
        let first_сicle_hours = Math.trunc(first_сicle_time / 60);
        let first_сicle_min = first_сicle_time % 60;
        let first_сicle_info = 'First cicle:' + first_сicle_hours + 'h' + first_сicle_min + 'm';
        let first_сicle_margin_left = ((work_iteration * work_time_length) + long_break_length) * 100;

        let total_hours = Math.trunc(total_time / 60);
        let total_minutes = total_time % 60;
        let total_info = total_hours + 'h' + total_minutes + 'm';
        let total_margin_left = 98;

        let tips_top = function(minutes, hours, margin_left, text_information) {
            let tip_top_div = document.createElement('div');
            tip_top_div.className = 'tips_top';
            let tip_top_information = document.createElement('p');
            tip_top_div.style.left = margin_left + '%';
            tip_top_information.innerHTML = text_information;
            tip_top_div.appendChild(tip_top_information);
            graphics__scale.appendChild(tip_top_div);

        }

        let tips_amount = Math.trunc((total_time / 30));
        let total_min = tips_amount * 30;
        let margin = 0;

        if (total_min !== total_time) {
            margin = (((total_min) / total_time) * 100) / tips_amount;
        } else {
            margin = 100 / tips_amount;
        }
        for (let i = 0; i <= tips_amount; i++) {
            let newTips = document.createElement('div');
            let newTips_paragraph = document.createElement('p');
            newTips.appendChild(newTips_paragraph);

            let mediaQuery = window.matchMedia('(min-width: 768px)');

            function func(media) {

                if (media.matches) {
                    if (i % 2 === 1 && i != 1) {
                        newTips_paragraph.innerHTML = Math.trunc(i / 2) + 'h' + '30m';
                        newTips.classList.add('tips_default');
                    } else if (i === 0) {
                        newTips_paragraph.innerHTML = '0m';
                        newTips.className = 'tips_top';
                    } else if (i === 1) {
                        newTips_paragraph.innerHTML = '30m'
                        newTips.classList.add('tips_default');
                    } else {
                        newTips_paragraph.innerHTML = Math.trunc(i / 2) + 'h';
                        newTips.classList.add('tips_default');
                    }
                } else {
                    if (i === 0) {
                        newTips_paragraph.innerHTML = '0m';
                        newTips.className = 'tips_top';

                    } else if (i % 2 === 1) {
                        newTips_paragraph.innerHTML = ' ';
                        newTips.classList.remove('tips_default');
                    } else if (i % 2 === 0) {
                        newTips_paragraph.innerHTML = Math.trunc(i / 2) + 'h';
                        newTips.classList.add('tips_default');
                    }


                }
            }
            mediaQuery.addListener(func);
            func(mediaQuery);

            newTips.style.left = margin * i + "%";

            graphics__scale.appendChild(newTips);
        }
        tips_top(first_сicle_hours, first_сicle_min, first_сicle_margin_left, first_сicle_info);
        tips_top(total_hours, total_minutes, total_margin_left, total_info);

    }

    let long_break_generation = function(long_break_length) {
        let long_break_div = document.createElement('div');
        long_break_div.className = 'long_break';
        long_break_div.style.width = (long_break_length) * 100 + '%';
        graphics__scale.appendChild(long_break_div);
    }


    let short_break_generation = function(number_of_breaks, work_iterations, work_time_length, short_break_length) {
        for (let i = 1; i <= number_of_breaks; i++) {
            let newDiv = document.createElement('div');
            newDiv.id = 'short-break' + i;
            newDiv.className = 'shortbreaks';
            newDiv.style.width = (short_break_length) * 100 + '%';
            if (i >= (work_iterations)) {
                newDiv.style.left = 'auto';
                newDiv.style.right = ((work_time_length * (i - (work_iterations - 1)) + short_break_length * (i - 1 - (work_iterations - 1))) * 100) + '%';

            } else {
                newDiv.style.left = ((work_time_length * i + short_break_length * (i - 1)) * 100) + '%';
            }

            graphics__scale.appendChild(newDiv);

        }
        return graphics__scale;
    }

    long_break_generation(long_break_length)
    short_break_generation(short_break_amount, work_iteration, work_time_length, short_break_length, graphics__scale);
    tips();
}

function graphics_initialization() {
    graphics_draw(parseInt(long_breaks.field.value),
        parseInt(short_breaks.field.value),
        parseInt(work_iterations.field.value),
        parseInt(work_times.field.value))
};
settings_default.set_default();
graphics_initialization();