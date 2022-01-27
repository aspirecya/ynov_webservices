
export default class Animation {
  constructor ({ element }) {
    this.element = element
    this.createObserver()
    this.animateOut()
  }

  createObserver () {
    this.observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // animation In
          this.animateIn()
        } else {
          // animation Out
          this.animateOut()
        }
      })
    })

    this.observer.observe(this.element)
  }

  animateOut () {

  }

  animateIn () {

  }

  onResize () {

  }
}
