const get = (target) => document.querySelector(target);
const getAll = (target) => document.querySelectorAll(target);

const flink = () => {
    const $links = getAll('a[href="#"]');
    $links.forEach((links) => {
        links.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });
};

const navi = () => {
    const header = document.querySelector('#header .type');
    const mainMenu = document.querySelectorAll('#header .type .nav .gnb .main-menu');
    header.addEventListener('mouseenter', (e) => {
        header.classList.add('on');
        mainMenu.forEach((menus, idx) => {
            menus.style.marginLeft = `100px`;
            menus.style.transition = `0.5s ease`;
        });
    });
    header.addEventListener('mouseleave', (e) => {
        mainMenu.forEach((menus, idx) => {
            menus.style.marginLeft = `30px`;
        });
        header.classList.remove('on');
        mainMenu[3].style.marginLeft = `60px`;
    });
};

const comInit = () => {
    const getPage = (page, tag) => {
        fetch(page)
            .then((res) => res.text())
            .then((res) => {
                get(tag).innerHTML = res;

                // 헤더푸터 생성 후 내부 기능 함수 호출! (!)
                navi();
                flink();
            });
    };
    getPage('page/header.html', '#header .type');
    getPage('page/footer.html', '#footer');
};

(() => {
    comInit();
})();
