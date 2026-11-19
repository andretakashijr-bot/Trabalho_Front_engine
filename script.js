gsap.registerPlugin(ScrollTrigger);

const cards = gsap.utils.toArray(".cards li");
const spacing = 0.1;
const snap = gsap.utils.snap(spacing);

if (cards.length > 0) {
  let iteration = 0;
  const seamlessLoop = buildSeamlessLoop(cards, spacing);

  const scrub = gsap.to(seamlessLoop, {
    totalTime: 0,
    duration: 0.5,
    ease: "power3",
    paused: true
  });

  const trigger = ScrollTrigger.create({
    start: 0,
    end: "+=3000",
    pin: ".gallery",
    onUpdate(self) {
      if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
        wrapForward(self);
      } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
        wrapBackward(self);
      } else {
        scrub.vars.totalTime = snap(
          (iteration + self.progress) * seamlessLoop.duration()
        );
        scrub.invalidate().restart();
        self.wrapping = false;
      }
    }
  });

  function wrapForward(scrollTrigger) {
    iteration++;
    scrollTrigger.wrapping = true;
    scrollTrigger.scroll(scrollTrigger.start + 1);
  }

  function wrapBackward(scrollTrigger) {
    iteration--;

    if (iteration < 0) {
      iteration = 9;
      seamlessLoop.totalTime(
        seamlessLoop.totalTime() + seamlessLoop.duration() * 10
      );
      scrub.pause();
    }

    scrollTrigger.wrapping = true;
    scrollTrigger.scroll(scrollTrigger.end - 1);
  }

  function scrubTo(totalTime) {
    const progress =
      (totalTime - seamlessLoop.duration() * iteration) /
      seamlessLoop.duration();

    if (progress > 1) {
      wrapForward(trigger);
    } else if (progress < 0) {
      wrapBackward(trigger);
    } else {
      trigger.scroll(
        trigger.start + progress * (trigger.end - trigger.start)
      );
    }
  }

  document.querySelector(".next").addEventListener("click", () => {
    scrubTo(scrub.vars.totalTime + spacing);
  });

  document.querySelector(".prev").addEventListener("click", () => {
    scrubTo(scrub.vars.totalTime - spacing);
  });
}

function buildSeamlessLoop(items, spacing) {
  const overlap = Math.ceil(1 / spacing);
  const startTime = items.length * spacing + 0.5;
  const loopTime = (items.length + overlap) * spacing + 1;

  const rawSequence = gsap.timeline({ paused: true });
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      if (this._time === this._dur) {
        this._tTime += this._dur - 0.01;
      }
    }
  });

  const totalItems = items.length + overlap * 2;

  gsap.set(items, {
    xPercent: 400,
    opacity: 0,
    scale: 0
  });

  for (let i = 0; i < totalItems; i++) {
    const index = i % items.length;
    const item = items[index];
    const time = i * spacing;

    rawSequence
      .fromTo(
        item,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          zIndex: 100,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "power1.in",
          immediateRender: false
        },
        time
      )
      .fromTo(
        item,
        { xPercent: 400 },
        {
          xPercent: -400,
          duration: 1,
          ease: "none",
          immediateRender: false
        },
        time
      );

    if (i <= items.length) {
      seamlessLoop.add("label" + i, time);
    }
  }

  rawSequence.time(startTime);

  seamlessLoop
    .to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: "none"
    })
    .fromTo(
      rawSequence,
      { time: overlap * spacing + 1 },
      {
        time: startTime,
        duration: startTime - (overlap * spacing + 1),
        immediateRender: false,
        ease: "none"
      }
    );

  return seamlessLoop;
}
