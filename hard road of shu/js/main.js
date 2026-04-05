/* ============================================
   Hard Roads in Shu - Main JavaScript
   ============================================ */

// Poem Data - Chinese verses with English translations
const poemData = [
    {
        cn: "噫吁嚱，危乎高哉！",
        en: "Oho! Behold! How high! How steep!"
    },
    {
        cn: "蜀道之难，难于上青天！",
        en: "The road to Shu is harder than climbing to the blue sky."
    },
    {
        cn: "蚕丛及鱼凫，开国何茫然！",
        en: "Cancong and Yufu, founders of the ancient Shu kingdom, Their deeds in the misty past are but legends now."
    },
    {
        cn: "尔来四万八千岁，不与秦塞通人烟。",
        en: "For forty-eight thousand years since then, No human trace has crossed the Qin mountains."
    },
    {
        cn: "西当太白有鸟道，可以横绝峨眉巅。",
        en: "Only birds could find a path west of Taibai Peak, Flying across the summit of Emei Mountain."
    },
    {
        cn: "地崩山摧壮士死，然后天梯石栈相钩连。",
        en: "When mountains crumbled and brave men died, Then heaven's ladders and stone bridges were linked."
    },
    {
        cn: "上有六龙回日之高标，下有冲波逆折之回川。",
        en: "Above, peaks so high that the six dragons of the sun must turn back; Below, rushing waves that churn and twist in the winding rivers."
    },
    {
        cn: "黄鹤之飞尚不得过，猿猱欲度愁攀援。",
        en: "Even the yellow crane cannot fly across; Even the monkeys despair of climbing over."
    },
    {
        cn: "青泥何盘盘，百步九折萦岩峦。",
        en: "The Qingni Ridge winds and twists, Nine turns in a hundred steps around the rocky peaks."
    },
    {
        cn: "扪参历井仰胁息，以手抚膺坐长叹。",
        en: "Touching the stars, one gasps for breath, Hand on chest, sitting down with a long sigh."
    },
    {
        cn: "问君西游何时还？畏途巉岩不可攀。",
        en: "Tell me, when will you return from your western journey? The perilous path with its jagged rocks cannot be climbed."
    },
    {
        cn: "但见悲鸟号古木，雄飞雌从绕林间。",
        en: "Only hear mournful birds crying in ancient trees, Males flying ahead, females following, circling through the forest."
    },
    {
        cn: "又闻子规啼夜月，愁空山。",
        en: "And hear the cuckoo weeping under the moon, Filling the empty mountains with sorrow."
    },
    {
        cn: "蜀道之难，难于上青天，使人听此凋朱颜！",
        en: "The road to Shu is harder than climbing to the blue sky, Hearing this makes one's rosy cheeks fade with fear!"
    },
    {
        cn: "连峰去天不盈尺，枯松倒挂倚绝壁。",
        en: "Peaks linked together, less than a foot from heaven, Withered pines hang upside down against sheer cliffs."
    },
    {
        cn: "飞湍瀑流争喧豗，砯崖转石万壑雷。",
        en: "Rushing torrents and cascading waterfalls clamor and roar, Boulders tumbling down cliffs like thunder in a thousand valleys."
    },
    {
        cn: "其险也如此，嗟尔远道之人胡为乎来哉！",
        en: "So dangerous it is! Alas, why have you come, You who must travel this distant road?"
    },
    {
        cn: "剑阁峥嵘而崔嵬，一夫当关，万夫莫开。",
        en: "Jianmen Pass rises steep and towering, One man guards it, ten thousand cannot pass."
    },
    {
        cn: "所守或匪亲，化为狼与豺。",
        en: "If the guardian is not loyal, he becomes a wolf or jackal, Ready to devour the unwary traveler."
    },
    {
        cn: "朝避猛虎，夕避长蛇；磨牙吮血，杀人如麻。",
        en: "Avoid the fierce tiger in the morning, the long serpent at night; They grind their teeth and suck blood, killing like hemp."
    },
    {
        cn: "锦城虽云乐，不如早还家。",
        en: "Though the Brocade City may be pleasant, It is better to return home early."
    },
    {
        cn: "蜀道之难，难于上青天，侧身西望长咨嗟！",
        en: "The road to Shu is harder than climbing to the blue sky, Turning westward with a long, long sigh!"
    }
];

// Map Location Data
const locationData = {
    'chang-an': {
        name: "Chang'an",
        nameCn: "长安",
        modernName: "Xi'an, Shaanxi Province",
        verse: "西当太白有鸟道，可以横绝峨眉巅",
        verseEn: "Only birds could find a path west of Taibai Peak",
        description: "The ancient capital of the Tang Dynasty, starting point of the journey to Shu. Chang'an was the largest city in the world during Li Bai's time.",
        image: "images/location-qinling.jpg"
    },
    'qinling': {
        name: "Qinling Mountains",
        nameCn: "秦岭",
        modernName: "Qinling Mountain Range, Shaanxi",
        verse: "尔来四万八千岁，不与秦塞通人烟",
        verseEn: "For forty-eight thousand years, no human trace has crossed the Qin mountains",
        description: "A major mountain range forming the natural boundary between northern and southern China. The Qinling was considered nearly impassable in ancient times.",
        image: "images/location-qinling.jpg"
    },
    'qingni': {
        name: "Qingni Ridge",
        nameCn: "青泥岭",
        modernName: "Qingni Ridge, Gansu Province",
        verse: "青泥何盘盘，百步九折萦岩峦",
        verseEn: "The Qingni Ridge winds and twists, nine turns in a hundred steps",
        description: "A treacherous mountain pass famous for its winding, narrow paths. Li Bai vividly describes the physical challenge of navigating this terrain.",
        image: "images/location-qingni.jpg"
    },
    'jianmen': {
        name: "Jianmen Pass",
        nameCn: "剑门关",
        modernName: "Jianmen Pass, Sichuan Province",
        verse: "剑阁峥嵘而崔嵬，一夫当关，万夫莫开",
        verseEn: "Jianmen Pass rises steep and towering; one man guards it, ten thousand cannot pass",
        description: "One of the most strategic mountain passes in China, guarding the entrance to the Sichuan Basin. Its steep cliffs made it nearly impregnable.",
        image: "images/location-jianmen.jpg"
    },
    'jincheng': {
        name: "Jincheng (Chengdu)",
        nameCn: "锦城（成都）",
        modernName: "Chengdu, Sichuan Province",
        verse: "锦城虽云乐，不如早还家",
        verseEn: "Though the Brocade City may be pleasant, it is better to return home early",
        description: "Known as the 'Brocade City' for its famous silk brocade, Chengdu was the prosperous capital of the Shu region and the destination of the journey.",
        image: "images/location-jincheng.jpg"
    }
};

// Initialize Reading Section
function initReadingSection() {
    const chinesePanel = document.getElementById('chinesePanel');
    const englishPanel = document.getElementById('englishPanel');
    
    if (!chinesePanel || !englishPanel) return;
    
    // Create Chinese verses
    poemData.forEach((verse, index) => {
        const verseEl = document.createElement('div');
        verseEl.className = 'verse';
        verseEl.dataset.index = index;
        verseEl.innerHTML = '<span class="verse-number">' + (index + 1) + '</span><span class="verse-cn">' + verse.cn + '</span>';
        chinesePanel.appendChild(verseEl);
    });
    
    // Create English verses
    poemData.forEach((verse, index) => {
        const verseEl = document.createElement('div');
        verseEl.className = 'verse';
        verseEl.dataset.index = index;
        verseEl.innerHTML = '<span class="verse-number">' + (index + 1) + '</span><span class="verse-en">' + verse.en + '</span>';
        englishPanel.appendChild(verseEl);
    });
    
    // Add hover interactions
    const chineseVerses = chinesePanel.querySelectorAll('.verse');
    const englishVerses = englishPanel.querySelectorAll('.verse');
    
    chineseVerses.forEach((verse, index) => {
        verse.addEventListener('mouseenter', function() {
            verse.classList.add('active');
            englishVerses[index].classList.add('active');
        });
        
        verse.addEventListener('mouseleave', function() {
            verse.classList.remove('active');
            englishVerses[index].classList.remove('active');
        });
    });
    
    englishVerses.forEach((verse, index) => {
        verse.addEventListener('mouseenter', function() {
            verse.classList.add('active');
            chineseVerses[index].classList.add('active');
        });
        
        verse.addEventListener('mouseleave', function() {
            verse.classList.remove('active');
            chineseVerses[index].classList.remove('active');
        });
    });
}

// Initialize Map Section
function initMapSection() {
    const mapPoints = document.querySelectorAll('.map-point');
    const mapInfo = document.getElementById('mapInfo');
    
    if (!mapPoints.length || !mapInfo) return;
    
    mapPoints.forEach(function(point) {
        point.addEventListener('click', function() {
            // Remove active class from all points
            mapPoints.forEach(function(p) { p.classList.remove('active'); });
            
            // Add active class to clicked point
            point.classList.add('active');
            
            // Get location data
            const locationId = point.dataset.id;
            const data = locationData[locationId];
            
            if (data) {
                // Update info panel
                mapInfo.innerHTML = '<h3>' + data.name + ' <span style="font-size: 0.8em; color: var(--gold);">| ' + data.nameCn + '</span></h3>' +
                    '<div class="map-info-item"><h4>Modern Location</h4><p>' + data.modernName + '</p></div>' +
                    '<div class="map-info-item"><h4>Related Verse</h4><p class="chinese-text" style="font-size: 1.1rem; margin-bottom: 0.5rem;">' + data.verse + '</p>' +
                    '<p style="font-style: italic; color: var(--ink-light);">' + data.verseEn + '</p></div>' +
                    '<div class="map-info-item"><h4>Description</h4><p>' + data.description + '</p></div>' +
                    '<img src="' + data.image + '" alt="' + data.name + '" class="map-info-image">';
            }
        });
    });
}

// Navigation Active State
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(function(section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(function(el) { revealObserver.observe(el); });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!menuToggle || !navLinksContainer) return;
    
    menuToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navLinksContainer.classList.remove('active');
        });
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar background on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0.8))';
        }
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initReadingSection();
    initMapSection();
    initScrollReveal();
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
});
