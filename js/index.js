// utils
const mapRange = (value, inputMin, inputMax, outputMin, outputMax, clamp) => {
  // Reference:
  // https://openframeworks.cc/documentation/math/ofMath/
  if (Math.abs(inputMin - inputMax) < Number.EPSILON) {
    return outputMin;
  } else {
    var outVal =
      ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
      outputMin;
    if (clamp) {
      if (outputMax < outputMin) {
        if (outVal < outputMax) outVal = outputMax;
        else if (outVal > outputMin) outVal = outputMin;
      } else {
        if (outVal > outputMax) outVal = outputMax;
        else if (outVal < outputMin) outVal = outputMin;
      }
    }
    return outVal;
  }
};

const lerp = (min, max, t) => min * (1 - t) + max * t;

// Do checkboxes thing
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
let clickedCount = 0;
let canDoAlert = true;
let canDoFinalAlert = true;

const alerts = [
  "Thanks, lol, that’s absolutely how this works. Appreciate your help.",
  "I can see you’re trying to be helpful but maybe you oughta let me tackle this one, champ.",
  "Listen, it’s MY bucket list. If you wanna plan a New York trip one of these days you can do that but this is my thing.",
  "It’s like a sick joke to you, isn’t it? Harassing a website like this. I’ve got friends, you know. Important friends. With Macbooks.",
  "Please bro",
  "Please",
  "Alright fuck it bro, vibe out. I can see this is important to you. Enjoy yourself. Go nuts bro",
];
const finalAlert = `Are you proud of yourself? Did you accomplish what you set out to do? Was it worth it?`;

const doAlert = () => {
  if (alerts.length <= clickedCount) {
    canDoAlert = false;
  } else {
    alert(alerts[clickedCount]);
    clickedCount += 1;
  }
};
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    const allCheckboxesAreChecked = [...checkboxes].every(
      (checkbox) => checkbox.checked
    );
    const noCheckboxesAreChecked = ![...checkboxes].some(
      (checkbox) => checkbox.checked
    );
    if (canDoAlert) {
      doAlert();
      if (e.currentTarget.checked) {
        e.currentTarget.checked = false;
      } else {
        e.currentTarget.checked = true;
      }
    } else if (
      (allCheckboxesAreChecked || noCheckboxesAreChecked) &&
      canDoFinalAlert
    ) {
      alert(finalAlert);
      canDoFinalAlert = false;
    }
  });
});

// do image parallaxing
let windowSize;
const getWindowSize = () =>
  (windowSize = { width: window.innerWidth, height: window.innerHeight });
getWindowSize();
window.addEventListener("resize", getWindowSize);

let distanceScrolled;
const getDistanceScrolled = () =>
  (distanceScrolled = window.pageYOffset || document.documentElement.scrollTop);
getDistanceScrolled();
window.addEventListener("scroll", getDistanceScrolled);

class Drifter {
  constructor(el) {
    this.DOM = { el: el };
    this.DOM.image =
      this.DOM.el.querySelector("picture") || this.DOM.el.querySelector("img");

    this.renderedStyles = {
      innerTranslationY: {
        previous: 0,
        current: 0,
        ease: 0.1,
        maxValue: parseInt(
          getComputedStyle(this.DOM.image).getPropertyValue("--overflow"),
          10
        ),
        setValue: () => {
          const maxValue = this.renderedStyles.innerTranslationY.maxValue;
          const minValue = -1 * maxValue;
          return Math.max(
            Math.min(
              mapRange(
                this.props.top - distanceScrolled,
                windowSize.height,
                -1 * this.props.height,
                minValue,
                maxValue
              ),
              maxValue
            ),
            minValue
          );
        },
      },
    };

    this.update();
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(
        (entry) => (this.isVisible = entry.intersectionRatio > 0)
      );
    });
    this.observer.observe(this.DOM.el);
    this.initEvents();
  }
  update() {
    this.getSize();
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[key].previous =
        this.renderedStyles[key].setValue();
    }
    this.layout();
  }

  getSize() {
    const rect = this.DOM.el.getBoundingClientRect();
    this.props = {
      height: rect.height,
      top: distanceScrolled + rect.top,
    };
  }
  initEvents() {
    window.addEventListener("resize", () => this.resize());
  }
  resize() {
    this.update();
  }
  render() {
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[key].setValue();
      this.renderedStyles[key].previous = lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].ease
      );
    }
    this.layout();
  }
  layout() {
    this.DOM.image.parentElement.style.setProperty(
      "--drift",
      `translate3d(0,${this.renderedStyles.innerTranslationY.previous}px,0)`
    );
  }
}

const images = document.querySelectorAll(".image");
const imageDrifters = [...images].map((image) => {
  return new Drifter(image);
});
const animate = () => {
  for (const image of imageDrifters) {
    if (image.isVisible) {
      image.render();
    }
  }
  requestAnimationFrame(() => animate());
};
animate();
