$.fn.run = function(options) {
    if (typeof(options) == 'undefined') return false;

    var settings = $.extend({
        fn: '',
        apps: {
            web: false,
            query: null,
        },
        card: {
            type: 'card'
        },
        device: {
            type: {
                mobile: navigator.userAgent.toLowerCase().match(/android|ipad|ipod|iphone|windows phone/i) !== null ? navigator.userAgent.toLowerCase().match(/android|ipad|ipod|iphone|windows phone/i)[0] : false,
                web: navigator.userAgent.toLowerCase().match(/windows|macintosh/i) !== null ? navigator.userAgent.toLowerCase().match(/windows|macintosh/i)[0] : false
            },
            get: function() {
                return settings.device.type;
            },
            set: function() {
                settings.device.type = {
                    mobile: navigator.userAgent.toLowerCase().match(/android|ipad|ipod|iphone|windows phone/i) !== null ? navigator.userAgent.toLowerCase().match(/android|ipad|ipod|iphone|windows phone/i)[0] : false,
                    web: navigator.userAgent.toLowerCase().match(/windows|macintosh/i) !== null ? navigator.userAgent.toLowerCase().match(/windows|macintosh/i)[0] : false
                }
            }
        },
        modal: {
            type: 'modal'
        },
        slider: {
            type: '',
            options: {
                adaptiveHeight: true,
                arrows: true,
                autoplay: true,
                autoplaySpeed: 6000,
                centerMode: false,
                dots: false,
                infinite: true,
                speed: 700,
                slidesToShow: 1,
                responsive: [{
                    breakpoint: 767,
                    settings: {
                        adaptiveHeight: true,
                        arrows: false,
                        dots: true
                    }
                }]
            }
        }
    }, options);

    this.each(function(index, el) {
        if ($(el).length) {
            window[options.fn].init($(el), settings);
        }
    });

    return false;

};

var userAgent = {
    init: function($el) {
        var ua = {
            ie: navigator.userAgent.toLowerCase().match(/userAgent|trident/ig) ? true : false,
            firefox: navigator.userAgent.toLowerCase().match(/firefox/ig) ? true : false,
            edge: navigator.userAgent.toLowerCase().match(/edge/ig) ? true : false,
            load: function() {
                if( this.ie ){
                    $el.addClass('ie')
                }else if( this.firefox ) {
                    $el.addClass('ff');
                }else if( this.edge ) {
                    $el.addClass('edge');
                }
            }
        }
        ua.load();
    }
};

var ellipsis = {
    init: function($el) {
        var ellip = {
            txt: $el.text(),
            link: '<a href="javascript:void(0);" class="dft-text-link text-link"></a>',
            load: function() {
                if (this.txt.length > 80 && window.matchMedia('(max-width: 992px)').matches) {
                    this.ellipsis();
                    this.click($el.find('.dft-text-link'));
                }
                this.resize();
            },
            ellipsis: function() {
                $el.text(this.txt.substring(0, 81) + '... ');
                this.addButton('Ver más');
            },
            addButton: function(txt) {
                $el.append(this.link);
                $el.find('.dft-text-link').text(txt);
            },
            click: function(el) {
                el.on('click', function() {
                    var txt = {};
                    if (!$el.hasClass('open-ellipsis')) {
                        txt.before = $el.text().substring(0, 81);
                        txt.after = ellip.txt.substring(81, ellip.txt.length);
                        $el.addClass('open-ellipsis');
                        $el.text(txt.before + txt.after + ' ');
                        ellip.addButton('Ver menos');
                    } else {
                        $el.removeClass('open-ellipsis');
                        ellip.ellipsis();
                    }
                    ellip.click($el.find('.dft-text-link'));
                });
            },
            resize: function() {
                window.addEventListener('resize', function() {
                    if (window.matchMedia('(max-width: 992px)').matches && !$el.find('.dft-text-link').length) {
                        $el.text(ellip.txt.substring(0, 81) + ' ... ');
                        ellip.addButton('Ver más');
                        ellip.click($el.find('.dft-text-link'));
                    } else if (window.matchMedia('(min-width: 993px)').matches && $el.find('.dft-text-link').length) {
                        $el.removeClass('open-ellipsis');
                        $el.text(ellip.txt);
                    }
                });
            }
        }
        ellip.load();
    }
}

var apps = {
    init: function($el, settings) {
        var app = {
            load: function() {
                this.hidden();
                this.resize();
            },
            hidden: function() {
                if (settings.device.type.mobile) {
                    this.hiddenMobile();
                } else if (settings.device.type.web && !settings.apps.web) {
                    this.hiddenWEB();
                } else if (settings.device.type.web && settings.apps.web) {
                    if (window.matchMedia('(max-width:' + settings.apps.query + 'px)').matches) {
                        this.hiddenWEB();
                    } else if (window.matchMedia('(min-width:' + settings.apps.query + 'px)').matches) {
                        this.resetWEB();
                    }
                }
            },
            hiddenMobile: function() {
                switch (settings.device.type.mobile) {
                    case 'android':
                        $el.find('.apple').addClass('hidden');
                        $el.find('.windows-phone').addClass('hidden');
                        $el.find('.google').removeClass('hidden');
                        break;
                    case 'ipad':
                    case 'ipod':
                    case 'iphone':
                        $el.find('.google').addClass('hidden');
                        $el.find('.windows-phone').addClass('hidden');
                        $el.find('.apple').removeClass('hidden');
                        break;
                    case 'windows phone':
                        $el.find('.google').addClass('hidden');
                        $el.find('.apple').addClass('hidden');
                        $el.find('.windows-phone').removeClass('hidden');
                        break;
                    default:
                        $el.find('.google').removeClass('hidden');
                        $el.find('.apple').addClass('hidden');
                        $el.find('.windows-phone').addClass('hidden');
                        break;
                }
            },
            hiddenWEB: function() {
                if (settings.device.type.web == 'windows') {
                    $el.find('.apple').addClass('hidden');
                    $el.find('.google').removeClass('hidden');
                    $el.find('.windows-phone').addClass('hidden');
                } else if (settings.device.type.web == 'macintosh') {
                    $el.find('.google').addClass('hidden');
                    $el.find('.apple').removeClass('hidden');
                    $el.find('.windows-phone').addClass('hidden');
                }
            },
            resetWEB: function() {
                $el.find('.apple').removeClass('hidden');
                $el.find('.google').removeClass('hidden');
                $el.find('.windows-phone').removeClass('hidden');
            },
            resize: function() {
                window.addEventListener('resize', function() {
                    settings.device.set();
                    app.hidden();
                });
            }
        }
        app.load();
    }
};

var card = {
    init: function($el, settings) {
        var cd = {
            load: function() {
                $el.addClass('dft-slick');
                switch (settings.card.type) {
                    case 'carousel-dots':
                        this.buildDots();
                        break;
                    case 'carousel-arrows':
                        this.buildArrows();
                        break;
                    case 'carousel-full':
                        this.buildArrows();
                        break;
                    default:
                        return false;
                        break;
                }
                this.type();
                this.resize();
                this.destroy();
            },
            buildDots: function() {
                $el.on('init', function(slick){
                    setTimeout( function(){
                        var carousel = $(slick.currentTarget)[0];  
                        $(carousel).find('.slick-track').css('transform','translate3d(0,0,0)');
                    }, 350)
                });

                if (window.matchMedia('(max-width: 992px)').matches || $el.find('.cross-item').length > 3 || $el.find('.dft-card-item').length > 3) {
                    if (!$el.hasClass('slick-slider')) {
                        $el.slick(settings.slider.options);
                    }
                } else {
                    if ($el.hasClass('slick-slider')) {
                        $el.slick('unslick');
                    }
                }
            },
            buildArrows: function() {
                $el.on('init', function(slick){
                    if( $(slick.currentTarget).hasClass('dft-card-benefits')){
                        var arrows = $(slick.currentTarget).find('.slick-arrow');
                        arrows.on('mouseenter', function(){ 
                            if( $(this).hasClass('slick-prev') && !$(this).hasClass('slick-disabled')){
                                $(slick.currentTarget).find('.slick-track').addClass('move-left'); 
                            }else if( $(this).hasClass('slick-next') && !$(this).hasClass('slick-disabled')){
                                $(slick.currentTarget).find('.slick-track').addClass('move-right'); 
                            }
                        });
                        arrows.on('mouseleave', function(){
                            if( $(this).siblings('.slick-list').find('.slick-track').hasClass('move-left') || $(this).siblings('.slick-list').find('.slick-track').hasClass('move-right') ){
                                $(this).siblings('.slick-list').find('.slick-track').removeClass('move-left move-right');
                            }
                        });
                    }
                });

                if (!$el.hasClass('slick-slider')) {
                    $el.slick(settings.slider.options);
                }
            },
            type: function() {
                if ($el.hasClass('dft-card-experience')) {
                    this.experience();
                }else if( $el.hasClass('dft-card-benefits') ){
                    this.benefits();
                }
            },
            experience: function() {
                var elements = {
                    linkPlus: $el.find('.more-info'),
                };

                elements.linkPlus.on('click', function() {
                    var parent = $(this).parent('.experience-item');
                    if (!parent.hasClass('open-info')) {
                        $el.find('.open-info').removeClass('open-info');
                        elements.linkPlus.find('> span').removeClass('dft-icon-close-fill').addClass('dft-icon-plus');
                        parent.addClass('open-info');
                        $(this).find('> span').removeClass('dft-icon-plus').addClass('dft-icon-close-fill');
                    } else {
                        parent.removeClass('open-info');
                        $(this).find('> span').removeClass('dft-icon-close-fill').addClass('dft-icon-plus');
                    }
                });
            },
            benefits: function(){
                var plus = $el.find('.benefits-item > a:not(.dft-text-link)');
                plus.on('click', function(){
                    if(!$(this).parent().hasClass('open-overlay') ){
                        $el.find('.benefits-item').removeClass('open-overlay');
                        $(this).parent().addClass('open-overlay');
                    }else{
                        $(this).parent().removeClass('open-overlay');
                    }
                });
                
                var benefits = document.querySelector('.dft-card-benefits'); 
                window.addEventListener('click', function(e){
                    if( !benefits.contains(e.target) && benefits.querySelectorAll('.benefits-item.open-overlay').length){
                        benefits.querySelector('.benefits-item.open-overlay').classList.remove('open-overlay');
                    }
                });
            },
            destroy: function(){
                if($el.attr('slick-destroy')){
                    for(var i = 0; i < $el.attr('slick-destroy').split('|').length; i++){
                        switch ($el.attr('slick-destroy').split('|')[i]) {
                            case 'tablet':
                                if(window.matchMedia('(max-width: 992px)').matches){
                                    $el.slick('unslick');
                                    return false;
                                }
                                break;
                            case 'mobile':
                                if(window.matchMedia('(max-width: 767px)').matches){
                                    $el.slick('unslick');
                                    return false;
                                }
                                break;                  
                        }
                    }

                    if(!$el.hasClass('slick-slider')){
                        $el.slick(settings.slider.options);
                    }
                }
            },
            resize: function() {
                window.addEventListener('resize', function() {
                    if (settings.card.type == 'carousel-dots') {
                        cd.buildDots();
                    } else if (settings.card.type == 'carousel-arrows') {
                        cd.buildArrows();
                    }
                    cd.destroy();
                });
            }
        }
        cd.load();
    }
};

var header = {
    init: function($el, settings) {
        var head = {
            bancaOptions: $el.find('.dropdown-menu'),
            offTop: $el.find('.dft-header-top').offset().top,
            event: false,
            device: {
                mobile: false,
                smartphone: false
            },
            hamburger: $el.find('.menu-hamburger'),
            help: $el.find('.help'),
            search: {
                el: $el.find('nav li.search'),
                input: $el.find('nav li.search .form-control')
            },
            load: function() {
                this.validateDevice();
                this.resize();
                this.clickSearch();
                this.clickHelp();
                this.disabledBancaOption();
                this.outerClick();
                this.fixed();
                this.scrolling();
            },
            validateDevice: function() {
                if (window.matchMedia('(max-width: 992px)').matches) this.device.mobile = true;
                else this.device.mobile = false;
                if (settings.device.type.mobile) this.device.smartphone = true;
                else this.device.smartphone = false;
                if (this.device.mobile || this.device.smartphone) {
                    this.clickMenu();
                }
            },
            scrolling: function() {
                window.addEventListener('scroll', function(e) {
                    head.fixed();
                    head.helpScrolling(this);
                });
            },
            helpScrolling: function(win) {
                if ($el.find('.dft-help').length) {
                    var limitHelp = $el.find('.dft-help').offset().top + $el.find('.dft-help').height() + $el.find('.dft-header-top').height();
                    if ($el.hasClass('open-help') && $(win).scrollTop() > limitHelp) {
                        $el.removeClass('open-help');
                    }
                }
            },
            fixed: function() {
                if (window.innerWidth > 992) {
                    if ($(window).scrollTop() > head.offTop) {
                        $el.addClass('fixed');
                    } else if ($(window).scrollTop() <= head.offTop) {
                        $el.removeClass('fixed');
                    }
                } else {
                    if ($el.hasClass('fixed')) {
                        $el.removeClass('fixed');
                    }
                }
            },
            clickMenu: function() {
                if (!this.event) {
                    this.hamburger.on('click', function(e) {
                        head.open(e, ['menu'], function() {
                            $el.hasClass('open-help') ? $el.removeClass('open-help') : false;
                            !$('body').hasClass('open-header') ? $('body').addClass('open-header') : $('body').removeClass('open-header');
                        });
                    });
                    this.event = true;
                }
            },
            clickSearch: function() {
                this.search.el.find('> .navbar-form .dft-icon-close-round').on('click', function(e) {
                    if (!head.search.el.hasClass('opening')) {
                        head.open(e, ['search'])
                    }
                });

                this.search.el.find('> a').on('click', function(e) {
                    head.search.el.addClass('opening');
                    head.open(e, ['search']);
                    setTimeout(function() {
                        head.search.el.removeClass('opening');
                    }, 350);
                });
            },
            clickHelp: function() {
                this.help.on('click', function(e) {
                    var event = e;
                    if ($el.find('.dft-help').length) {
                        if (window.matchMedia('(max-width: 992px)').matches) {
                            head.open(e, ['menu'], function() {
                                $('body').hasClass('open-header') ? $('body').removeClass('open-header') : false;
                                $('body').stop().animate({ scrollTop: 0 }, 500, 'swing', function() {
                                    head.open(event, ['help'])
                                });
                            });
                        } else {
                            if ($el.hasClass('fixed')) {
                                $('body').stop().animate({ scrollTop: 0 }, 500, 'swing', function() {
                                    head.open(event, ['help'])
                                });
                            } else {
                                head.open(event, ['help'])
                            }
                        }
                    }
                });
            },
            open: function(event, array, callback) {
                for (var type in array) {
                    if (event && event.type != 'resize') {
                        if (!$el.hasClass('open-' + array[type])) {
                            $el.addClass('open-' + array[type]);
                            if (array[type] == 'search') {
                                head.search.input.focus();
                            }
                            if (array[type] == 'menu') {
                                $el.find('.dft-header-top .nav + ul').scrollTop(0);
                            }
                        } else {
                            $el.removeClass('open-' + array[type]);
                            if (array[type] == 'search') {
                                head.search.input.val('');
                            }
                        }
                    } else if (event && event.type == 'resize') {
                        if ($el.hasClass('open-' + array[type])) {
                            $el.removeClass('open-' + array[type]);
                            if (array[type] == 'search') {
                                head.search.input.val('');
                            }
                        }
                    }
                }
                if (typeof(callback) == 'function') callback();
            },
            disabledBancaOption: function() {
                this.bancaOptions.on('mouseenter', function() {
                    if ($(this).find('> li.active').length) $(this).find('> li.active').removeClass('active');
                    $(this).off('mouseenter');
                });
            },
            resize: function() {
                window.addEventListener('resize', function(e) {
                    head.open(e, ['menu', 'search', 'help']);
                    $('body').hasClass('open-header') ? $('body').removeClass('open-header') : false;
                    head.validateDevice();
                    head.fixed();
                    $el.find('.dft-help .form-control').val('');
                }, false);
            },
            outerClick: function() {
                window.addEventListener('click', function(e) {
                    var outer = {
                        header: document.querySelector('.dft-header'),
                        help: {
                            el: document.querySelector('.dft-header .dft-help'),
                            button: document.querySelector('.dft-header .help'),
                        },
                        search: document.querySelector('.dft-header .search')
                    };

                    if (!outer.header.contains(e.target) && $el.hasClass('open-menu')) {
                        head.open(e, ['menu'], function() {
                            $('body').removeClass('open-header');
                        });
                    }

                    if ($(outer.help.el).length) {
                        if (!outer.help.el.contains(e.target) && $el.hasClass('open-help') && !outer.help.button.contains(e.target)) {
                            $el.removeClass('open-help');
                            $el.find('.dft-help .form-control').val('');
                        }
                    }

                    if (!outer.search.contains(e.target) && $el.hasClass('open-search')) {
                        head.open(e, ['search']);
                    }
                });
            }
        }
        head.load();
    }
};

var heroImage = {
    init: function($el, settings) {
        var hero = {
            html: $el.html(),
            pages: { current: 0, all: 0 },
            load: function() {
                this.events();
                $el.addClass('dft-slick');
                $el.slick(settings.slider.options)
            },
            events: function() {
                $el.on('init', function(slick) {
                    if (!$(this).find('.slick-paginator').length) {
                        $(this).append('<span class="hidden-xs slick-paginator">1/1</span>');
                        hero.pages.all = $(this).find('.slick-slide').length - 2;
                        $(this).find('.slick-paginator').text('1/' + hero.pages.all);
                    }
                });
                $el.on('afterChange', function(slick, currentSlide) {
                    if ($(this).find('.slick-paginator').length) {
                        hero.pages.current = $(this).find('.slick-slide.slick-active').index();
                        $(this).find('.slick-paginator').text(hero.pages.current + '/' + hero.pages.all);
                    }
                });
                $el.on('breakpoint', function(slick, currentSlide) {
                    if ($(this).find('.slick-paginator').hasClass('slick-slide')) {
                        $(this).slick('unslick');
                        $(this).html('');
                        $(this).html($(hero.html).clone());
                        $el.slick(settings.slider.options);
                    }
                });
            }
        }
        hero.load();
    }
};

var modal = {
    init: function($el, settings) {
        var mdl = {
            id: $el.find('a[data-toggle="modal"]').attr('href'),
            paginator: $el.find('.slick-paginator'),
            load: function() {
                switch (settings.modal.type) {
                    case 'modal-print':
                    this.modalPrint();
                        break;

                    case 'modal-carousel':
                        this.modalCarousel();
                        this.resize();
                        break;
                };

            },
            modalPrint : function(){
                if( $('html').hasClass('ie') || $('html').hasClass('ff') || $('html').hasClass('edge') ){
                    $el.find('.dft-text-link.print').remove();
                    $el.addClass('not-print');
                    return false;
                }
                var 
                    buttonPrint = $el.find('.dft-text-link.print'),
                    sourcePrint = buttonPrint.attr('print').split('|')[1].trim(),
                    sourceID = buttonPrint.attr('print').split('|')[0].trim();
                    iframe = '<iframe src="'+sourcePrint+'" id="'+sourceID+'" scrolling="no" name="'+sourceID+'" frameborder="0" width="0" height"0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>';

                buttonPrint.parent().append( iframe );

                buttonPrint.on('click', function(){        
                        window.frames[sourceID].focus();
                        window.frames[sourceID].print();
                });
            },
            modalCarousel: function() {
                if (this.paginator.length) {
                    var slide = {
                        index: 0,
                        total: $el.find('.dft-slick').children().length
                    }
                    $el.find('.dft-slick').on('init', function(slick, currentSlide) {
                        mdl.paginator.text("1 / " + slide.total);
                    });
                    $el.find('.dft-slick').on('afterChange', function(slick, currentSlide) {
                        slide.index = $(this).find('.slick-slide.slick-active').index() + 1;
                        mdl.paginator.text(slide.index + " / " + slide.total);
                    });
                }

                if ($el.find('.dft-slick').length) {
                    if (!$el.find('.dft-slick').hasClass('slick-slider')) {

                        $el.find('.dft-slick').slick(settings.slider.options);
                    }
                } else {
                    console.warn('No se encontro la clase .dft-slick como contenedor hijo de .modal-body');
                }
            },
            resize: function() {
                $(window).on('resize', function() {
                    if (settings.modal.type == 'modal-carousel') mdl.modalCarousel();
                });
            }
        }
        mdl.load();
    }
}

var tooltipExit = {
    init: function($el, settings) {
        var tooltip = {
            content: $('body').find('.dft-tooltip-content'),
            overlay: '<div class="overlay-tooltip"></div>',
            load: function() {
                this.click();
                this.resize();
                this.bodyOverlay();
                this.eventCloseMobile();
            },
            click: function() {
                $el.on('click', function(e) {
                    e.preventDefault();
                    tooltip.existTooltip();
                    tooltip.set($(this));
                    tooltip.insert($(this));
                    if ($(this).hasClass('condusef')) {
                        $('body').addClass('body-tooltip special-tooltip');
                    } else {
                        tooltip.bodyMobile($(this));
                    }
                });
            },
            existTooltip: function() {
                if ($('.open-tooltip').length) {
                    $('.open-tooltip').find('.dft-tooltip-content').remove();
                    $('.open-tooltip').removeClass();
                }
            },
            set: function(link) {
                var data = JSON.parse($(link).attr('data-tooltip'));
                typeof(data.metrica) != "undefined" && data.metrica != "" ? this.content.find('.tooltip-out-link .dft-text-link').attr('onclick', data.metrica) : this.content.find('.tooltip-out-link .dft-text-link').removeAttr('onclick');
                if (!$(link).hasClass('condusef')) {
                    typeof(data.legal) !== 'undefined' ? this.content.find('.tooltip-out-text .tooltip-legal').text(data.legal): this.content.find('.tooltip-out-text .tooltip-legal').text('');
                    typeof(data.target) !== 'undefined' ? this.content.find('.tooltip-out-link .dft-text-link').attr('target', data.target): false;
                    this.content.find('.tooltip-out-text .tooltip-text').text(data.name);
                    this.content.find('.tooltip-out-link .dft-text-link').attr('href', data.link);
                }
            },
            insert: function(link) {
                if (window.innerWidth > 992) {
                    if (!$(link).hasClass('condusef')) {
                        link.parent().append(tooltip.content.clone());
                    } else {
                        link.parent().append(tooltip.condusef());
                    }
                    link.parent().addClass('open-tooltip');
                    tooltip.close([link.parent().find('.dft-tooltip-content .dft-icon-close-fill'), link.parent().find('.dft-tooltip-content .dft-text-link')]);
                } else if (window.matchMedia('(max-width: 992px)').matches && $(link).hasClass('condusef')) {
                    link.parent().append(tooltip.condusef());
                    link.parent().addClass('open-tooltip');
                    tooltip.close([link.parent().find('.dft-tooltip-content .dft-icon-close-fill'), link.parent().find('.dft-tooltip-content .dft-text-link')]);
                }
            },
            close: function(elements) {
                $(elements).each(function(index, el) {
                    $(el).on('click', function() {
                        $('.open-tooltip').find('.dft-tooltip-content').remove();
                        $('.open-tooltip').removeClass('open-tooltip');
                        tooltip.bodyMobile();
                    });
                });
            },
            bodyOverlay: function() {
                if (window.matchMedia('(max-width: 992px)').matches && !$('body .overlay-tooltip').length) {
                    $('body').append(this.overlay)
                } else if (window.innerWidth > 992 && $('body .overlay-tooltip').length) {
                    $('body .overlay-tooltip').remove();
                }
            },
            bodyMobile: function(link) {
                if (window.matchMedia('(max-width: 992px)').matches) {
                    if (!$('body').hasClass('body-tooltip')) {
                        $('body').addClass('body-tooltip')
                        this.bodyOverlay();
                    } else {
                        $('body').removeClass('body-tooltip special-tooltip');
                    }
                }
            },
            eventCloseMobile: function() {
                if (!$('body').find('.dft-footer .dft-tooltip-content').hasClass('event-close')) {
                    $('body').find('.dft-footer .dft-tooltip-content').addClass('event-close');
                    this.close([this.content.find('.dft-icon-close-fill'), this.content.find('.dft-text-link')]);
                }
            },
            resize: function() {
                window.addEventListener('resize', function() {
                    if (this.innerWidth > 992 && $('.open-tooltip .condusef').length) {
                        $('body').removeClass('body-tooltip special-tooltip');
                        tooltip.bodyOverlay();
                    } else if (this.innerWidth <= 992 && $('.open-tooltip .condusef').length) {
                        $('body').addClass('body-tooltip special-tooltip');
                        tooltip.bodyOverlay();
                    } else if (this.innerWidth <= 992 && $('.open-tooltip').length) {
                        $('body').addClass('body-tooltip');
                        $('.open-tooltip').find('.dft-tooltip-content').remove();
                        tooltip.bodyOverlay();
                        tooltip.countEvent++;
                    } else if (this.innerWidth > 992 && $('body').hasClass('body-tooltip')) {
                        $('body').removeClass('body-tooltip');
                        tooltip.bodyOverlay();
                        if ($('.open-tooltip').length) {
                            $('.open-tooltip').append(tooltip.content.clone());
                            var elements = $('.open-tooltip').find('.dft-tooltip-content');
                            tooltip.close([elements.find('.dft-text-link'), elements.find('.dft-icon-close-fill')]);
                        }
                    }
                });
            },
            condusef: function() {
                var html =
                    '<div class="dft-tooltip-content xs-bg-white">' +
                    '<div class="tooltip-out-text xs-pd-top-15 xs-pd-right-15 xs-pd-bottom-15 xs-pd-left-15 lg-pd-top-15 lg-pd-right-15 lg-pd-bottom-15 lg-pd-left-15">' +
                    '<p class="dft-text font-b">Unidad Especializada de <br />Atención (UNE) </p>' +
                    '<p class="dft-text cr-grey-11 element-inline xs-mr-bottom-10 lg-mr-bottom-10">Telefono: (55) 1226 4583 <br /> Email: <a href="mailto:unebanamex@banamex.com" class="dft-text-link">unebanamex@banamex.com</a> </p>' +
                    '<p class="dft-text font-b">Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF)</p>' +
                    '<p class="dft-text cr-grey-11 xs-mr-bottom-10 lg-mr-bottom-10">Teléfono: (55) 5340 0999 <br /> Del Interior de la República sin costo: 01(800) 999 8080 <br /> http://www.gob.mx/condusef </p>' +
                    '<p class="dft-text font-b">El sitio de CONDUSEF es ajeno a Citibanamex, responsable de sus propios contenidos y mantiene su política de privacidad y seguridad.</p>' +
                    '</div>' +
                    '<div class="tooltip-out-link text-center xs-bg-grey-1 xs-pd-top-10 xs-pd-right-15 xs-pd-bottom-10 xs-pd-left-15 lg-pd-top-10 lg-pd-right-15 lg-pd-bottom-10 lg-pd-left-15">' +
                    '<a href="http://www.gob.mx/condusef" class="dft-text-link inline-icon link-arrow" onclick="s.tl(this,\'o\',\'MX|home-TextoFooter-29062017-Information-irCONDUSEF-ES\')" target="_blank">' +
                    ' <p class="text-link font-b">Continuar</p>' +
                    '<span class="dft-icon-arrow-right"></span>' +
                    '</a>' +
                    '</div>' +
                    '<span class="dft-icon-close-fill cursor-pointer"></span>' +
                    '</div>';

                return html;
            }
        }
        tooltip.load();
    }
}

var collapsedScreen = {
    init: function($el) {
        var screen = {
            load: function() {
                $el.find('[aria-expanded]').on('click', function(){
                    if(!$(this).parent().find('> .dft-title').hasClass('collapsed')){
                        $(this).parent().find('> .dft-title').addClass('collapsed');
                    }else{
                     $(this).parent().find('> .dft-title').removeClass('collapsed');
                    }
                });
            }
        }
        screen.load();
    }
};

var video = {
    init: function($el) {
        var vd = {
            playButton : $el.find('.dft-text-link.pulse-video'),
            options:{},
            load: function() {
                this.playButton.on( 'click', function(){
                    vd.options.id = $(this).attr('video-id');
                    vd.options.html = '<div id="'+vd.options.id+'" class="video-kaltura" style="overflow: hidden;"><iframe id="'+vd.options.id+'_ifp" scrolling="no" name="'+vd.options.id+'_ifp" aria-labelledby="Player '+vd.options.id+'" aria-describedby="The Kaltura Dynamic Video Player" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="border: 0px; max-width: 100%; max-height: 100%; width: 100%; height: 100%;"></iframe></div>	<script src="https://cdnapisec.kaltura.com/p/972141/sp/97214100/embedIframeJs/uiconf_id/10092001/partner_id/972141?autoembed=true&amp;entry_id='+vd.options.id+'&amp;playerId='+vd.options.id+'&amp;cache_st=1479136424&amp;width=630&amp;height=390"></script>';
                    $el
                        .removeClass('pulse-infinite pulse-static')
                        .addClass('pulse-init video-playing')
                        .append(vd.options.html);
                    
                    $el.on('DOMNodeInserted', function(){
                            if(typeof kWidget != "undefined"){
                                kWidget.addReadyCallback( function( playerId ){
                                   document.getElementById(vd.options.id).sendNotification("doPlay");
                                });
                            }
                    });
                });
            }
        }
        vd.load();
    }
};

var screenMultiple = {
    init: function($el) {
        var sm = {
            panels : $el.find('.panel'),
            load: function() {
                $el.on('shown.bs.collapse', function(){
                    sm.panels.find('> a[aria-expanded=false]').addClass('multiple-disabled');
                    sm.panels.find('> a[aria-expanded=true]').removeClass('multiple-disabled');
                });

                $el.on('hidden.bs.collapse', function(){
                    if(!sm.panels.find('> a[aria-expanded=true]').length){
                        sm.panels.find('> a').removeClass('multiple-disabled');
                    }
                });
            }
        }
        sm.load();
    }
}

$(document).ready(function() {

    //Detected IE>8, Edge & Firefox 
    $('html').run({ fn: 'userAgent' })
    
    //dft-apps
 $('.dft-apps:not(.apps-web)').run({
        fn: 'apps'
    });

   $('.dft-apps.apps-web').run({
        fn: 'apps',
        apps: {
            web: true,
            query: 992
        }
    });
    //dft-hero-image
    $('[slick-slider="hero-image"]').run({
        fn: 'heroImage'
    });

    //header
    $('.dft-header').run({
        fn: "header"
    });

    //cards
    $('[slick-card="carousel-dots"]').run({
        fn: 'card',
        card: {
            type: "carousel-dots",
        },
        slider: {
            options: {
                arrows: false,
                centerMode: true,
                dots: true,
                infinite: false,
                speed: 700,
                slidesToShow: 1,
                variableWidth: true,
                mobileFirst: true,
            }
        }
    });

    $('[slick-card="carousel-arrows"]').run({
        fn: 'card',
        card: {
            type: "carousel-arrows",
        },
        slider: {
            options: {
                arrows: true,
                dots: false,
                centerMode: false,
                infinite: false,
                speed: 700,
                slidesToShow: 3,
                variableWidth: true,
                responsive: [{
                    breakpoint: 992,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        dots: true,
                        slidesToShow: 1,
                    }
                }]
            }
        }
    });

    $('[slick-card="carousel-full"]').run({
        fn: 'card',
        card: {
            type: "carousel-arrows",
        },
        slider: {
            options: {
                arrows: true,
                dots: false,
                centerMode: false,
                infinite: false,
                speed: 700,
                slidesToShow: 4,
                slidesToScroll: 2,
                variableWidth: true,
                responsive: [{
                    breakpoint: 1200,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        dots: true,
                        slidesToShow: 1
                    }
                }]
            }
        }
    });


    //Tooltip
    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    });

    //Modal Carousel
    $('.dft-modal-carousel').run({
        fn: 'modal',
        modal: {
            type: 'modal-carousel'
        },
        slider: {
            options: {
                arrows: true,
                dots: false,
                infinite: false,
                speed: 700,
                slidesToShow: 1,
                variableWidth: true,
                responsive: [{
                    breakpoint: 992,
                    settings: {
                        arrows: false,
                        dots: true
                    }
                }]
            }
        }
    });

    //Tooltip Exit
    $('.dft-tooltip-exit').run({
        fn: 'tooltipExit'
    });

    //Ellipsis
    $('[data-ellipsis]').run({
        fn: 'ellipsis'
    })

    //Collapsed 
    $('.dft-screen').run({
        fn: 'collapsedScreen'
    })

    //Modal Print
    $('.dft-modal-print').run({
        fn :'modal',
        modal : {
            type : 'modal-print'
        }
    });

    //Video HTML5
    $('.dft-video').run({
        fn: 'video'
    });

    //Multi-screen
    $('.dft-screen-multiple').run({
        fn: 'screenMultiple'
    });

});

