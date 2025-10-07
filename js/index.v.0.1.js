let APP = {}
let $document = $(document)

// APP UTILS =======================================================================
APP.utils = {
    debounce: (func, delay) => {
        let timeoutId
        return function (...args) {
            const context = this
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                func.apply(context, args)
            }, delay)
        }
    },
    throttle: (func, delay) => {
        let lastCall = 0
        return function (...args) {
            const context = this
            const now = Date.now()
            if (now - lastCall >= delay) {
                func.apply(context, args)
                lastCall = now
            }
        }
    }
}


APP.gsap = () => {
    gsap.registerPlugin(ScrollTrigger);
}


APP.header = {

    headerMobileMenu: (modalSelector, openHandlerSelector, closeHandlerSelector) => {
        const $modal = $(modalSelector)
        const $modalContent = $(`${modalSelector}__content`)
        const $openBtn = $(openHandlerSelector)
        const $closeBtn = $(closeHandlerSelector)
        const INTERACTIVE_ELEMENTS = `${modalSelector}__content, ${openHandlerSelector}`

        const openOptions = () => { }
        const closeOptions = () => { }

        const open = () => {
            $modal.fadeIn(400)
            $modalContent.slideDown(400)
            $openBtn.addClass('open')

            openOptions()
        }

        const close = () => {
            $modal.fadeOut(400)
            $modalContent.slideUp(400)

            $openBtn.removeClass('open')
            closeOptions()
        }

        const modalHandler = () => {
            if ($openBtn.hasClass('open')) {
                close()
            } else {
                open()
            }
        }

        const init = () => {
            $modal.hide()
            $openBtn.on('click', modalHandler)
            $closeBtn.on('click', close)

            $(document).on('click', (e) => {
                if (!$(e.target).closest(INTERACTIVE_ELEMENTS).length) {
                    close()
                }
            })
        }

        init()

        return {
            open,
            close,
            modalHandler,
            openOptions,
            closeOptions
        }
    },

    headerChangeColor: function () {
        const $header = $('header')

        ScrollTrigger.create({
            start: "top -1",
            end: "bottom top",
            toggleClass: { targets: $header, className: "scrolled" },
        })

    },



    init: function () {
        this.headerChangeColor()
        this.headerMobileMenu(
            '.menu-modal',
            '.header__container .mobile .btn'
        )
    },

}

APP.services = {

    mobileDropdown: {

        changeVisibility: function () {
            $('.services-block__text .ui-services-list').toggle($(window).width() > 767)
        },
        createHandlers: function () {
            $('.services-block__text').each(function () {
                const $this = $(this)
                const $dropdown = $this.find('.ui-services-list')
                const $btn = $this.find('.mobile-toggle-list')

                let textState = $btn.find('.text').text()


                $btn.on('click', function () {
                    $dropdown.slideToggle()
                    $btn.toggleClass('open')
                    if ($btn.hasClass('open')) {
                        $btn.find('.text').text('Hide')
                    } else {
                        $btn.find('.text').text(textState)
                    }

                })
            })
        },
        init: function () {
            this.createHandlers()
            this.changeVisibility()

            const handleResize = APP.utils.debounce(() => {
                this.changeVisibility()
            }, 50);

            window.addEventListener('resize', handleResize);
        }

    },
    init: function () {
        this.mobileDropdown.init()
    }
}

APP.realStoriesSlider = () => {
    let realStoriesSlider = new Swiper('.real-stories-slider', {
        loop: true,
        autoplay: {
            delay: 10000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
            waitForTransition: true,
        },
        navigation: {
            prevEl: '.real-stories-prev',
            nextEl: '.real-stories-next',
        },
        pagination: {
            el: '.real-stories-slider__pagination',
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 'auto',
                spaceBetween: 16,
                slidesOffsetAfter: 16,
                slidesOffsetBefore: 16,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 20,

                slidesOffsetAfter: 0,
                slidesOffsetBefore: 0,
            }
        },
        on: {
            init(swiper) {
                checkSliderState(swiper)
            },
            resize(swiper) {
                const handleResize = APP.utils.debounce(() => {
                    swiper.update()
                    checkSliderState(swiper)

                }, 100);
                handleResize()
            }
        }
    })



    function checkSliderState(swiper) {
        const $controls = $('.real-stories-slider__controls')
        if (swiper.isLocked) {
            $controls.fadeOut()
        } else {
            $controls.fadeIn()
        }
    }
}



APP.gotQuestion = {
    headerHeight: null,

    pinNavigation: function () {
        const $container = $('.got-questions')
        const $element = $container.find('.got-questions__nav')
        const $images = $container.find('.got-question-desktop .images__container')



        const titleHeioght = $('.got-questions__title').height()
        const navMargin = 32


        let offset = titleHeioght + navMargin - this.headerHeight - 8
        let endOffset = $container.height() - offset - $images.height()
        endOffset = $images.height() + $element.height() + 16 + this.headerHeight


        ScrollTrigger.create({
            trigger: $container[0],
            endTrigger: '.got-questions__slider__container',
            pin: $element[0],
            start: () => `top+=${offset} top`,
            end: () => `bottom-=${endOffset}`,
        })

    },

    changeImage: function () {
        const images = gsap.utils.toArray(".got-question-desktop .images__container .got-question-desktop-image");
        const blocks = gsap.utils.toArray(".got-question-desktop .text__container .got-question-text-content");
        const navigation = gsap.utils.toArray('.got-questions__nav a')

        if (images.length <= 0 && blocks.length <= 0 && navigation.length <= 0) {
            return
        }

        images[0].classList.add('active')
        navigation[0].classList.add('active')

        blocks.forEach((block, i) => {
            ScrollTrigger.create({
                trigger: block,
                start: "top center",
                end: 'top top',
                onEnter: () => setActiveImage(i),
                onEnterBack: () => setActiveImage(i),
            });
        });

        function setActiveImage(index) {
            images.forEach((img, i) => {
                img.classList.toggle("active", i === index);
            });
            navigation.forEach((link, i) => {
                link.classList.toggle("active", i === index);
            });
        }
    },
    changeSlideHandler: function () {
        const navigation = gsap.utils.toArray('.got-questions__nav a')
        const buttons = gsap.utils.toArray('.got-chage-slide')

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const dir = btn.dataset.dir
                const activeIndex = navigation.findIndex(link => link.classList.contains('active'))

                let newIndex
                if (dir === 'next' && activeIndex < navigation.length - 1) {
                    newIndex = activeIndex + 1
                } else if (dir === 'prev' && activeIndex > 0) {
                    newIndex = activeIndex - 1
                }

                // Якщо індекс змінився — тоді клікаємо
                if (newIndex !== activeIndex) {
                    if (navigation[newIndex]) {
                        navigation[newIndex].click()
                    }
                }
            })
        })
    },
    initDesktop: function () {
        this.headerHeight = $('header').innerHeight()

        // Виклик методів з затримкою для коректної ініціалізації
        setTimeout(() => {
            this.changeImage()
            this.pinNavigation()
            this.changeSlideHandler()
            console.log('init:',)
            console.log(':',)
        }, 500)
    },
    mobileDropDown: function () {
        $('.got-question-text-content.mobile .title').click(function () {
            $(this).toggleClass('active')
            $(this).siblings('.dropdown').slideToggle()
        })
    },



    init: function () {
        let self = this;
        this.mobileDropDown()

        ScrollTrigger.matchMedia({
            // Десктоп
            "(min-width: 768px)": function () {
                self.initDesktop()
            },

            // Мобільний
            "(max-width: 767px)": function () {
                // нічого не робимо — всі ScrollTrigger-и від попереднього режиму автоматично знищуються
            }
        })
        window.addEventListener('load', function () {
            // ScrollTrigger.refresh();
        })
    }
}

APP.hiwSlider = () => {
    if (window.hiwSwiperInstance) {
        window.hiwSwiperInstance.destroy(true, true);
    }

    window.hiwSwiperInstance = new Swiper('.hiwSlider', {
        slidesPerView: 'auto',
        slidesOffsetBefore: 16,
        slidesOffsetAfter: 16,
        loop: true,
        effect: "fade",
        pagination: {
            el: '.hiw-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<div class="' + className + '">' + (index + 1) + "</div>";
            },
        }
    });
}


APP.texdPopup = {
    createModal: (modalSelector, openHandlerSelector, closeHandlerSelector) => {
        const $modal = $(modalSelector)
        const $modalContent = $(`${modalSelector}__container`)
        const $openBtn = $(openHandlerSelector)
        const $closeBtn = $(closeHandlerSelector)
        const INTERACTIVE_ELEMENTS = `${modalSelector}__container, ${openHandlerSelector}`
        let isOpen = false

        const open = () => {
            isOpen = true
            $modal.fadeIn(400)
            $openBtn.addClass('opened-popup')
            $('body').addClass('overflow-hidden')
        }

        const close = () => {
            isOpen = false
            $modal.fadeOut(400)
            $openBtn.removeClass('opened-popup')
            $('body').removeClass('overflow-hidden')
            console.log(':',)
        }

        const modalHandler = () => {
            if ($openBtn.hasClass('opened-popup')) {
                close()
            } else {
                open()
            }
        }

        const init = () => {
            $modal.hide()
            $openBtn.on('click', modalHandler)
            $closeBtn.on('click', close)

            $(document).on('click', (e) => {
                if (!$(e.target).closest(INTERACTIVE_ELEMENTS).length && isOpen) {
                    close()
                }
            })
        }

        init()
    },
    init: function () {
        this.createModal(
            '.modal-privacy-policy',
            '.open-privacy-popup',
            '.close-modal-privacy-policy'
        )
        this.createModal(
            '.modal-terms',
            '.open-terms-popup',
            '.close-modal-terms'
        )
    }
}

APP.smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1);
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

$document.ready(function () {
    APP.gsap()
    APP.header.init()
    APP.services.init()
    APP.realStoriesSlider()

    APP.hiwSlider()
    APP.texdPopup.init()

    APP.gotQuestion.init();

    const handleResize = APP.utils.debounce(() => {
    }, 300);
    APP.smoothScroll()

    window.addEventListener('resize', handleResize);
})
