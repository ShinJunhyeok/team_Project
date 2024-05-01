// import { blogPost, eventPost, guidePost } from './data.js';
import {
    terms,
    channels,
    solutions,
    languages,
    industryTypes,
    inquirys,
    products,
} from '../data/data.js';

/* --------------------------------------------------------------------
create bt kang-young-hyun
at 2024-04-22 / blogList, blogGoToPage
--------------------------------------------------------------------*/
// blog + blog 하위페이지

const blogList = () => {
    // blog list + 본문 내 prev, next posting 기능 구현
    const $listing = get('.blog .left-flex-list .listing');
    const $blogPaging = get('.blog .left-flex-list .paging ');
    let postPerPage = 6,
        currentPage = 1,
        firstPost,
        lastPost,
        postMod,
        pageNumber,
        totalPage,
        posts = 0;

    const blogCondense = () => {
        const $inner = get('.blog .inner');
        const $blogLis = getAll('.blog .left-flex-list .listing li');
        const $sum = get('.blog .right-flex-text');
        const $sumDate = get('.blog .right-flex-text .date');
        const $sumTitle = get('.blog .right-flex-text p');
        const $sumMainTitle = get('.blog .right-flex-text strong');
        const $sumQues = get('.blog .right-flex-text em');
        const $sumDummy1 = get('.blog .right-flex-text b:nth-of-type(1)');
        const $sumDummy2 = get('.blog .right-flex-text b:nth-of-type(2)');
        const $blogMore = get('.blog .right-flex-text p.blog-more a');
        let blogCur = firstPost;

        const sumKeyframes = [
            { transform: 'translateY(100px)', opacity: 0 },
            { transform: 'translateY(0px)', opacity: 1 },
        ];
        const sumOptions = {
            duration: 800,
            easing: 'ease',
            fill: 'forwards',
        };

        conText(blogCur);
        window.localStorage.setItem(`num`, blogCur);
        $blogLis[0].classList.add('on');

        $blogLis.forEach((li) => {
            li.addEventListener('click', (e) => {
                $sum.animate(sumKeyframes, sumOptions);
                let blogId = e.target.getAttribute('data-id');
                conText(blogId - 1);
                $blogLis.forEach((lis, idx) => {
                    lis.classList.remove('on');
                });
                e.currentTarget.classList.add('on');
            });
        });

        function conText(num) {
            // 블로그 우측 요약글
            let conNum = posts[num];
            $sumDate.innerHTML = `${conNum.date}`;
            $sumTitle.innerHTML = `${conNum.title}`;
            $sumMainTitle.innerHTML = `${conNum.mainTitle}`;
            $sumQues.innerHTML = `${conNum.ques}`;
            $sumDummy1.innerHTML = `${conNum.textDummy1}`;
            $sumDummy2.innerHTML = `${conNum.textDummy2}`;
            $blogMore.href = 'blogPost.html';
            window.localStorage.setItem(`num`, num);
        }
    };
    const makePaging = () => {
        // 페이징 생성
        const pageClick = (e) => {
            switch (e.currentTarget.textContent) {
                case 'prev':
                    currentPage = currentPage > 1 ? currentPage - 1 : currentPage;
                    break;
                case 'next':
                    currentPage = currentPage < pageNumber ? currentPage + 1 : currentPage;
                    break;
                default:
                    currentPage = Number(e.currentTarget.textContent);
            }

            getData();
        };
        $blogPaging.innerHTML = '';
        for (let i = 0; i < pageNumber; i++) {
            const a = document.createElement('a');
            a.textContent = i + 1;

            if (i == currentPage - 1) {
                a.classList.add('on');
            }
            $blogPaging.appendChild(a);
        }

        const minPrevBtn = document.createElement('a');
        const maxNextBtn = document.createElement('a');
        minPrevBtn.textContent = 'prev';
        maxNextBtn.textContent = 'next';
        $blogPaging.prepend(minPrevBtn);
        $blogPaging.append(maxNextBtn);

        const $blogPagings = getAll('.blog .left-flex-list .paging a');
        $blogPagings.forEach((paging) => {
            paging.addEventListener('click', pageClick);
        });
    };
    const makeList = () => {
        // 좌측 게시판 리스팅
        $listing.innerHTML = '';

        for (let i = firstPost; i < lastPost; i++) {
            const li = document.createElement('li');
            li.textContent = posts[i].title;
            li.setAttribute('data-id', posts[i].id);
            $listing.appendChild(li);
        }
    };
    const getData = () => {
        posts = blogPost;
        totalPage = blogPost.length;
        postMod = totalPage % postPerPage;
        pageNumber = Math.ceil(totalPage / postPerPage);
        firstPost = (currentPage - 1) * postPerPage;
        lastPost =
            currentPage == pageNumber && postMod !== 0
                ? firstPost + postMod
                : firstPost + postPerPage;

        makeList(currentPage);
        makePaging();
        blogCondense();
    };

    getData();
};
const blogGoToPage = () => {
    // 본문 연결 + 이전, 다음글 링크
    const $backList = get('.blog-more a');
    const $blogPrev = get('.blog-post .move-post .prev');
    const $blogPrevTitle = get('.blog-post .move-post .prev .title');
    const $blogNext = get('.blog-post .move-post .next');
    const $blogNextTitle = get('.blog-post .move-post .next .title');
    const $postDate = get('.blog-post article .date');
    const $postTitle = get('.blog-post article .title');
    const $postContent = get('.blog-post article div');
    let cnt = Number(localStorage.getItem('num'));
    let old = 0;

    const btnPN = () => {
        if (cnt <= 0) {
            $blogNextTitle.textContent = `${blogPost[cnt + 1].id}. ${blogPost[cnt + 1].title}`;
        } else if (cnt >= blogPost.length) {
            $blogPrevTitle.textContent = `${blogPost[cnt - 1].id}. ${blogPost[cnt - 1].title}`;
        } else {
            $blogPrevTitle.innerHTML = `${blogPost[cnt - 1].id}. ${blogPost[cnt - 1].title}`;
            $blogNextTitle.innerHTML = `${blogPost[cnt + 1].id}. ${blogPost[cnt + 1].title}`;
        }
    };
    const numbering = (cnt) => {
        console.log(cnt);
        if (cnt < 0 || cnt > blogPost) return;
        scrollTo(0, 0);
        window.localStorage.setItem(`num`, cnt);
        $postDate.textContent = blogPost[cnt].date;
        $postTitle.textContent = blogPost[cnt].title;
        $postContent.innerHTML = blogPost[cnt].html;
        old = cnt;
        btnPN(cnt);
    };
    numbering(cnt);
    $blogPrev.addEventListener('click', (e) => {
        cnt = cnt <= -1 ? 0 : --cnt;

        numbering(cnt);
    });
    $blogNext.addEventListener('click', (e) => {
        cnt >= blogPost.length + 1 ? blogPost.length : ++cnt;
        numbering(cnt);
    });

    btnPN();
};

/* --------------------------------------------------------------------
create bt kang-young-hyun
at 2024-04-21 / eventList (on, fin)
--------------------------------------------------------------------*/
// 이벤트 (진행/종료)
const eventListOn = () => {
    // card view listing + list more,  modal + event_Dday 구현
    const $evBar = getAll('.event .ev-bar span');

    const $cardViewUl = get('.event .event-card-view ul');
    const $seeMore = get('.event .see-more');
    const $body = get('body');

    // 모달 부모
    const $modal = get('.event .ev-modal');
    const $modalCon = get('.event .ev-modal .modal-con');

    // 모달(팝업) 내부 선언
    const $timer = get('.event .ev-modal .top-timer p');
    const $evImg = get('.event .ev-modal .ev-content em img');
    const $title = get('.event .ev-modal .ev-content h2');
    const $subTitle = get('.event .ev-modal .ev-content strong');
    const $desc = get('.event .ev-modal .ev-content span');
    const $info = getAll('.event .ev-modal .ev-content .info li');
    const $close = get('.event .ev-modal .ev-content p.close');

    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    let ongoing = [...eventPost].filter(
        (x) =>
            (x.year === 2024 && x.month == month && x.date > day) ||
            (x.year >= 2024 && x.month > month)
    );

    let maxCard = 6,
        cnt = 0,
        current = 0,
        data = ongoing,
        countdown = null;

    $cardViewUl.innerHTML = '';

    const dDay = (keys) => {
        const dday = new Date(keys.year, keys.month, keys.date);
        const gapTime = dday.getTime() - today.getTime();

        const days = Math.floor(gapTime / (1000 * 60 * 60 * 24)) - 30;
        const hours = Math.floor(gapTime / (1000 * 60 * 60)) % 24;
        const minutes = Math.floor(gapTime / (1000 * 60)) % 60;
        const seconds = Math.floor(gapTime / 1000) % 60;

        $timer.innerHTML = `이벤트 마감까지 <span>D-${days}일 ${hours}시간 ${minutes}분</span>남았어요!`;
    };
    const moInner = (id) => {
        // 모달 컨텐츠

        let keys = data[id];
        $evImg.setAttribute('src', `${keys.moUrl}`);
        $evImg.setAttribute('alt', `${keys.subTitle}`);
        $title.innerHTML = `${keys.title}`;
        $subTitle.innerHTML = `${keys.subTitle}`;
        $desc.innerHTML = `${keys.desc}`;
        $info[0].innerHTML = `일자 : ${keys.year}.${keys.month}.${keys.date}`;
        $info[1].innerHTML = `${keys.loca}`;

        dDay(keys);
    };

    const modalView = () => {
        const $cards = getAll('.event .event-card-view ul li');
        $cards[0].classList.add('act');
        $cards.forEach((card, idx) => {
            // 클릭 시 모달 띄우기
            card.addEventListener('click', (e) => {
                current = idx;
                $modal.style.display = 'block';
                $body.style.overflow = 'hidden';

                // 항상 스크롤 맨 위로
                const scrollModal = document.getElementById('modal');
                scrollModal.scrollIntoView(true);

                moInner(e.currentTarget.getAttribute('data-id'));
            });
            card.addEventListener('mouseenter', (e) => {
                $cards.forEach((items) => {
                    items.classList.remove('act');
                });
                $cards[idx].classList.add('act');
            });
            card.addEventListener('mouseleave', (e) => {
                $cards.forEach((items) => {
                    // items.classList.remove('act');
                });
            });
        });
    };

    const makeCard = () => {
        if (cnt > data.length - 1) return;

        // maxCard 의 조건을 걸어줘야함
        maxCard = data.length - cnt > 6 ? 6 : data.length - cnt;
        for (let i = 0; i < maxCard; i++) {
            const li = document.createElement('li');
            const b = document.createElement('b');
            const p1 = document.createElement('p');
            const p2 = document.createElement('p');
            const span = document.createElement('span');
            const p3 = document.createElement('p');
            li.setAttribute('data-id', cnt);
            li.style.backgroundImage = `url(${data[cnt].bgUrl})`;
            b.textContent = data[cnt].cate;
            p1.innerHTML = data[cnt].title;
            p1.classList.add('title');
            p2.innerHTML = data[cnt].subTitle;
            p2.classList.add('sub-title');
            span.textContent = `${data[cnt].year}. ${data[cnt].month}. ${data[cnt].date}`;
            span.classList.add('date');
            p3.classList.add('popup-more');
            p3.innerHTML = `<i class="bx bx-right-arrow-alt"></i>`;

            li.append(b, p1, p2, span, p3);
            $cardViewUl.append(li);
            cnt++;
        }

        modalView();
    };
    makeCard();

    const closing = () => {
        $modal.style.display = 'none';
        $body.style.overflow = 'auto';
    };
    document.addEventListener('mouseup', (e) => {
        if (!$modalCon.contains(e.target)) {
            closing();
        }
    });
    $close.addEventListener('click', () => {
        closing();
    });
    $seeMore.addEventListener('click', (e) => {
        makeCard();
    });

    $evBar.forEach((bars, idx) => {
        bars.addEventListener('click', (e) => {
            $evBar.forEach((bItem) => {
                bItem.classList.remove('on');
            });
            $evBar[idx].classList.add('on');
        });
    });
};
const eventListFin = () => {
    // card view listing + list more,  modal + event_Dday 구현

    const $cardViewUl = get('.event .event-card-view ul');
    const $seeMore = get('.event .see-more');

    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    let finished = [...eventPost].filter(
        (x) => (x.year === 2024 && x.month < month) || x.year === 2023
    );

    let maxCard = 6,
        cnt = 0,
        data = finished;

    $cardViewUl.innerHTML = '';

    const makeCard = () => {
        if (cnt > data.length - 1) return;

        // maxCard 의 조건을 걸어줘야함
        maxCard = data.length - cnt > 6 ? 6 : data.length - cnt;
        for (let i = 0; i < maxCard; i++) {
            const li = document.createElement('li');
            const b = document.createElement('b');
            const p1 = document.createElement('p');
            const p2 = document.createElement('p');
            const span = document.createElement('span');
            const p3 = document.createElement('p');
            li.setAttribute('data-id', cnt);
            li.style.backgroundImage = `url(${data[cnt].bgUrl})`;
            b.textContent = data[cnt].cate;
            p1.innerHTML = data[cnt].title;
            p1.classList.add('title');
            p2.innerHTML = data[cnt].subTitle;
            p2.classList.add('sub-title');
            span.textContent = `${data[cnt].year}. ${data[cnt].month}. ${data[cnt].date}`;
            span.classList.add('date');
            p3.classList.add('popup-more');
            p3.innerHTML = `<i class="bx bx-right-arrow-alt"></i>`;

            li.append(b, p1, p2, span, p3);
            $cardViewUl.append(li);
            $cardViewUl.classList.add('end');
            cnt++;
        }

        // modalView();
    };
    makeCard();

    $seeMore.addEventListener('click', (e) => {
        makeCard();
    });
};

/* --------------------------------------------------------------------
create bt kang-young-hyun
at 2024-04-22 / guideList
--------------------------------------------------------------------*/

const guideList = () => {
    const $cates = getAll('.guide .tab-bar .tab li');
    const $searchValue = get('.guide .tab-bar .search input');
    const $searchBtn = get('.guide .tab-bar .search button');
    const $guideTbody = get('.guide table tbody');
    const $guidePaging = get('.guide .guide-paging');
    let word = '';
    let postsPerPage = 8;
    let currentPage = 1;
    let firstPost,
        lastPost,
        pageNumber,
        postMod,
        totalPage,
        posts = 0;

    // 포스팅 날짜 최신순 정렬
    let listAll = [...guidePost].sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    posts = listAll;

    const makePaging = () => {
        const pageAdd = (e) => {
            e.preventDefault();
            switch (e.currentTarget.textContent) {
                case 'prev':
                    currentPage = currentPage > 1 ? currentPage - 1 : currentPage;
                    break;
                case 'next':
                    currentPage = currentPage < pageNumber ? currentPage + 1 : currentPage;
                    break;
                default:
                    currentPage = Number(e.currentTarget.textContent);
            }
            getGuide();
        };

        $guidePaging.innerHTML = '';

        for (let i = 1; i <= pageNumber; i++) {
            const a = document.createElement('a');
            a.setAttribute('href', '#');
            a.textContent = i;

            if (i === currentPage) {
                a.classList.add('on');
            }
            $guidePaging.append(a);
        }
        const minPrevBtn = document.createElement('a');
        const maxNextBtn = document.createElement('a');
        minPrevBtn.textContent = 'prev';
        maxNextBtn.textContent = 'next';
        $guidePaging.prepend(minPrevBtn);
        $guidePaging.append(maxNextBtn);

        let $allpagings = getAll('.guide .guide-paging a');
        $allpagings.forEach((a, idx) => {
            a.addEventListener('click', pageAdd);
        });
    };
    const makeLIst = () => {
        $guideTbody.innerHTML = '';
        for (let i = firstPost; i < lastPost; i++) {
            const tr = document.createElement('tr');
            const num = document.createElement('td');
            const cate = document.createElement('td');
            const title = document.createElement('td');
            const titleLink = document.createElement('a');
            const date = document.createElement('td');
            num.textContent = i + 1;
            cate.textContent = posts[i].cate;

            titleLink.textContent = posts[i].title;
            titleLink.setAttribute('href', `${posts[i].url}`);
            titleLink.setAttribute('target', '_blank');
            date.textContent = posts[i].date;
            title.append(titleLink);
            tr.append(num, cate, title, date);
            $guideTbody.append(tr);
        }
    };

    const getGuide = () => {
        if (posts.length < postsPerPage) {
            postsPerPage = posts.length;
        }
        pageNumber = Math.ceil(posts.length / postsPerPage);
        totalPage = posts.length;
        postMod = totalPage % postsPerPage;
        firstPost = (currentPage - 1) * postsPerPage;
        lastPost =
            currentPage === pageNumber && postMod !== 0
                ? firstPost + postMod
                : firstPost + postsPerPage;

        makePaging();
        makeLIst(currentPage);
    };
    getGuide();

    $cates.forEach((cates, idx) => {
        cates.addEventListener('click', (e) => {
            postsPerPage = 8;
            currentPage = 1;

            let name = e.target.textContent;
            let newList = [];
            if (name !== '전체') {
                newList = [...guidePost].filter((key) => {
                    return key.cate == name;
                });
            } else if (name === '전체') {
                newList = listAll;
            }
            posts = newList;

            getGuide();

            $cates.forEach((cate, idx) => {
                cate.classList.remove('on');
            });
            $cates[idx].classList.add('on');
        });
    });
    const wordSend = () => {
        postsPerPage = 8;
        currentPage = 1;

        word = $searchValue.value;
        if (!word || word === ' ') return;
        $searchValue.value = '';
        $searchValue.focus();

        let searchList = [];
        searchList = [...guidePost].filter(
            (words) => words.title.toLowerCase().indexOf(word.toLowerCase()) !== -1
        );
        posts = searchList;
        getGuide();
    };
    $searchBtn.addEventListener('click', (e) => {
        wordSend();
    });
    $searchValue.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            wordSend();
        }
    });
};

/* --------------------------------------------------------------------
create bt kang-young-hyun
at 2024-04-25 / (백그라운드  & 가격정보 애니메이션)
--------------------------------------------------------------------*/
const rollingTxt = () => {
    const $bgTxt = get('.price .bg-txt h3');
    const eleWidth = $bgTxt.scrollWidth;
    let cnt = 0;
    const moveCnt = (cnt, element, direction) => {
        if (cnt > eleWidth / 2) {
            element.style.transform = `translateX(0)`;
            cnt = 0;
        }
        element.style.transform = `translateX(${cnt * direction}px)`;
        return cnt;
    };
    const rollingAni = () => {
        cnt = cnt + 1;
        cnt = moveCnt(cnt, $bgTxt, -1);
        window.requestAnimationFrame(rollingAni);
    };
    rollingAni();
    window.addEventListener('scroll', (e) => {
        cnt += 10;
    });
};
const priceAni = () => {
    const $priceLis = getAll('.price .pay-list ul li');

    let observer = new IntersectionObserver((e) => {
        e.forEach((lis) => {
            if (lis.isIntersecting) {
                setTimeout(() => {
                    lis.target.style.opacity = 1;
                    lis.target.style.transform = `translateY(0px)`;
                }, 300);
            } else {
                // 화면에서 없어지면 투명도 0
                setTimeout(() => {
                    lis.target.style.opacity = 0;
                    lis.target.style.transform = `translateY(50px)`;
                }, 300);
            }
        });
    });

    // observe()컨텐츠가 뷰포트에 나타나는지 확인해줌
    observer.observe($priceLis[0]);
    observer.observe($priceLis[1]);
    observer.observe($priceLis[2]);
};

/* --------------------------------------------------------------------
create by shin-jun-hyeok
at 2024-05-01 / (솔루션 공통 , Cargo-insight , Iot cargo monitoring)
--------------------------------------------------------------------*/

// 솔루션 공통
const tab = () => {
    const $tabMenus = getAll('.soln-tab .tab-menu li');
    const $tabLists = getAll('.soln-tab .tab-list li');

    $tabMenus.forEach((tab, idx) => {
        tab.addEventListener('click', (e) => {
            $tabMenus.forEach((tabs, idx) => {
                tabs.classList.remove('on');
                $tabLists[idx].style.opacity = 0;
            });
            e.currentTarget.classList.add('on');
            $tabLists[idx].style.opacity = 1;
        });
    });
};

const scrollCommon = () => {
    let $video = get('.soln-vid .video video');
    window.addEventListener('scroll', (e) => {
        if (window.scrollY >= 1800) {
            $video.play();
        }
    });
};

const solCommon = () => {
    tab();
    scrollCommon();
};

// cargo.html - 롤링배너
const cargoBanner = () => {
    const $bannerLi = getAll('.cargo .cargo-area1 ul li ');
    const $paging = getAll('.cargo .cargo-area1 .paging a');
    let bannerWidth = $bannerLi[0].offsetWidth;
    let cnt = 0,
        old = 0,
        length = $bannerLi.length,
        timer = null,
        interval = 5000;

    const slide = () => {
        $bannerLi[cnt].style.transition = '0s';
        $bannerLi[cnt].style.left = `${bannerWidth}px`;
        $bannerLi[cnt].style.zIndex = '10';

        setTimeout(() => {
            $bannerLi[cnt].style.transition = '0.4s';
            $bannerLi[cnt].style.left = '0px';
            $paging[cnt].classList.add('on');
            $bannerLi[old].style.left = `${bannerWidth * -1}px`;
            $bannerLi[old].style.zIndex = '1';
            $paging[old].classList.remove('on');
            old = cnt;
        }, 50);
    };
    const time = () => {
        cnt++;
        if (cnt > length - 1) {
            cnt = 0;
        }
        slide();
    };
    timer = setInterval(time, interval);
    $paging.forEach((page, idx) => {
        page.addEventListener('click', (e) => {
            cnt = idx;
            slide();
            clearInterval(timer);
            timer = setInterval(time, interval);
        });
    });
};

// iot - 버튼클릭 배너
const iotBanner = () => {
    const $btns = getAll('.iot .iot-area5 .slide-banner .btn a');
    const $banner = get('.iot .iot-area5 ul');
    const $bannerLi = getAll('.iot .iot-area5 ul li');
    let first,
        last,
        current = 0,
        len = $bannerLi.length,
        liwidth = $bannerLi[0].offsetWidth;

    const opacity = () => {
        $bannerLi.forEach((li) => {
            li.classList.remove('on');
        });
        $bannerLi[current].classList.add('on');
    };

    last = document.querySelector('.iot .iot-area5 ul li:last-child');
    $banner.prepend(last);
    $banner.style.transition = 'none';
    $banner.style.marginLeft = `-${liwidth}px`;

    $btns[0].addEventListener('click', (e) => {
        current++;
        if (current > len - 1) {
            current = 0;
        }
        $banner.style.transition = 'margin-left 0.4s ease';
        $banner.style.marginLeft = parseInt(getComputedStyle($banner).marginLeft) - liwidth + 'px';
        setTimeout(() => {
            first = document.querySelector('.iot .iot-area5 li:first-child');
            $banner.append(first);
            $banner.style.transition = 'none';
            $banner.style.marginLeft = `-${liwidth}px`;
            opacity();
        }, 10);
    });

    $btns[1].addEventListener('click', (e) => {
        current--;
        if (current < 0) {
            current = len - 1;
        }
        $banner.style.transition = 'margin-left 0.4s ease';
        $banner.style.marginLeft = parseInt(getComputedStyle($banner).marginLeft) + liwidth + 'px';
        setTimeout(() => {
            last = document.querySelector('.iot .iot-area5 ul li:last-child');
            $banner.prepend(last);
            $banner.style.transition = 'none';
            $banner.style.marginLeft = `-${liwidth}px`;
            opacity();
        }, 10);
    });
};

// iot.html - 스크롤 이벤트
const iotScroll = () => {
    let $images1 = get('.iot .iot-area1 .speech');
    let $images2 = get('.iot .iot-area4 ul');
    let $videoArea = get('.iot .iot-area6 .video');
    let $videos = getAll('.iot .iot-area6 .video ul li');

    window.addEventListener('scroll', (e) => {
        if (window.scrollY >= 720) {
            $images1.classList.add('on');
        }
    });

    window.addEventListener('scroll', (e) => {
        if (window.scrollY >= 4047) {
            $images2.classList.add('on');
        }
    });
    $videoArea.addEventListener('wheel', (e) => {
        document.body.style.overflow = 'hidden';
        if (e.deltaY > 0) {
            $videos.forEach((video) => {
                video.classList.toggle('on');
            });
        } else {
            $videos.forEach((video) => {
                video.classList.toggle('on');
            });
        }
    });
    window.addEventListener('click', (e) => {
        document.body.style.overflow = 'unset';
    });
};

//
/* ------------------------------------------------------------------------
create by shin-jun-hyeok
at 2024-04-23 /faqPage
------------------------------------------------------------------------ */
// faq.html - 아코디언
const faqPage = () => {
    const $accordionList = getAll('.faq .accordion li');
    const $accordionBtn = getAll('.faq .accordion li div span i');
    $accordionList.forEach((list, idx) => {
        list.addEventListener('click', (e) => {
            list.classList.toggle('active');
            if (list.classList.contains('active')) {
                $accordionBtn[idx].style.rotate = '-180deg';
            } else {
                $accordionBtn[idx].style.rotate = '0deg';
            }
        });
    });
};

/* ------------------------------------------------------------------------
create by shin-jun-hyeok
at 2024-04-24 /imgSlide ,loginForm
------------------------------------------------------------------------ */
// login.html - 이미지배너
const imgSlide = () => {
    const $slideImg = getAll('.login-page .img-slide .slide li');
    const $paging = getAll('.login-page .img-slide .paging li');
    let slideWidth = $slideImg[0].offsetWidth;
    let cnt = 0,
        old = 0,
        length = $slideImg.length,
        timer = null,
        interval = 3000;

    const slide = () => {
        $slideImg[cnt].style.transition = '0s';
        $slideImg[cnt].style.left = `${slideWidth}px`;
        $slideImg[cnt].style.zIndex = '10';

        setTimeout(() => {
            $slideImg[cnt].style.transition = '0.4s';
            $slideImg[cnt].style.left = '0px';
            $paging[cnt].classList.add('active');
            $slideImg[old].style.left = `${slideWidth * -1}px`;
            $slideImg[old].style.zIndex = '1';
            $paging[old].classList.remove('active');
            old = cnt;
        }, 50);
    };
    const time = () => {
        cnt++;
        if (cnt > length - 1) {
            cnt = 0;
        }
        slide();
    };
    timer = setInterval(time, interval);
    $paging.forEach((page, idx) => {
        page.addEventListener('click', (e) => {
            cnt = idx;
            slide();
            clearInterval(timer);
            timer = setInterval(time, interval);
        });
    });
};

// login.html - 로그인 형식
const loginForm = () => {
    let $email = get('.login-page .login-form .login-input .email');
    let $password = get('.login-page .login-form .login-input .password');
    let $loginBtn = get('.login-page .login-form .btn-wrap .btn-login');
    let $signupBtn = get('.login-page .login-form .btn-wrap .btn-signup');
    let emailTxt = '';
    let pwdTxt = '';
    $loginBtn.addEventListener('click', (e) => {
        emailTxt = $email.value;
        pwdTxt = $password.value;

        if (emailTxt.indexOf('@') === -1 || emailTxt.split('@')[1].indexOf('.') === -1) {
            alert('이메일 형식이 올바르지않습니다.');
            $email.focus();
        } else if (pwdTxt === '') {
            alert('비밀번호를 입력해주세요.');
            $password.focus();
        } else {
            window.open('./index.html');
        }
    });

    $signupBtn.addEventListener('click', (e) => {
        window.open('./signup.html');
    });
};

// login.html - 아이디 저장
const saveId = () => {
    const userLoginId = getCookie('');
    const checkId = get('.login-page .login-form .login-option p #checkbox');
};

/* ------------------------------------------------------------------------
create by shin-jun-hyeok
at 2024-04-29 /signUpAgree, signUpSelect, signUpCheck, signUpSubmit
------------------------------------------------------------------------ */
// signup.html - 전체동의 체크
const signUpAgree = () => {
    const $personal = get('.signup form .agree .personalInfo');
    const $use = get('.signup form .agree .termsOfUse');
    const $chks = getAll('input[type=checkbox]');
    const $chk = getAll('.signup form .agree .chkbox .chk');
    let isChecked = true;

    $personal.value = terms[0].desc;
    $use.value = terms[1].desc;

    $chks.forEach((check, idx) => {
        check.addEventListener('change', (e) => {
            isChecked = true;
            if (check.name === 'all') {
                $chks.forEach((chk1) => {
                    chk1.checked = all.checked;
                });
            }
            $chk.forEach((chk2) => {
                isChecked = chk2.checked && isChecked;
            });
            all.checked = isChecked;
        });
    });
};
// signup.html - 셀렉트박스 옵션
const signUpSelect = () => {
    const $channel = get('.signup form .input p .channel');
    const $solution = get('.signup form .input p .solution');
    const $language = get('.signup form .input p .language');
    channels.forEach((item, idx) => {
        let option = document.createElement('option');
        option.setAttribute('value', item.value);
        option.innerHTML = item.name;
        $channel.appendChild(option);
    });
    solutions.forEach((item, idx) => {
        let option = document.createElement('option');
        option.setAttribute('value', item.value);
        option.innerHTML = item.name;
        $solution.appendChild(option);
    });
    languages.forEach((item, idx) => {
        let option = document.createElement('option');
        option.setAttribute('value', item.value);
        option.innerHTML = item.name;
        $language.appendChild(option);
    });
};

// signup.html - 유효성검사
const signUpCheck = () => {
    let $chk1 = get('.signup form .agree .chkbox #chk1');
    let $chk2 = get('.signup form .agree .chkbox #chk2');
    let $id = get('.signup form .input p #userName');
    let $email = get('.signup form .input p #userEmail');
    let $company = get('.signup form .input p #companyName');
    let $tel = get('.signup form .input p em #phone');
    let $chan = get('.signup form .input p #channel');
    let $sol = get('.signup form .input p #solution');
    let $lan = get('.signup form .input p #language');

    if ($chk1.checked === false) {
        alert('개인정보 이용에 동의해주세요.');
        return false;
    } else if ($chk2.checked === false) {
        alert('이용약관에 동의해주세요.');
        return false;
    } else if ($id.value === '') {
        alert('사용자 성함을 입력해 주세요.');
        $id.focus();
    } else if ($email.value.indexOf('@') === -1 || $email.value.split('@')[1].indexOf('.') === -1) {
        alert('이메일 형식이 올바르지 않습니다.');
        $email.focus();
    } else if ($company.value === '') {
        alert('회사명을 입력해 주세요.');
        $company.focus();
    } else if ($tel.value === '') {
        alert('전화번호를 입력해 주세요.');
        $tel.focus();
    } else if ($chan.value === '') {
        alert('유입채널을 선택해 주세요.');
        $chan.focus();
    } else if ($sol.value === '') {
        alert('관심 솔루션을 선택해 주세요.');
        $sol.focus();
    } else if ($lan.value === '') {
        alert('언어를 선택해 주세요.');
        $lan.focus();
    } else {
        alert('사용신청이 완료되었습니다.');
        window.location.replace('./login.html');
    }
};

// signup.html - 제출버튼
const signUpSubmit = () => {
    const $btn = get('.signup form .btn button');
    $btn.addEventListener('click', (e) => {
        signUpCheck();
    });
};

/* ------------------------------------------------------------------------
create by shin-jun-hyeok
at 2024-04-30 /inquirySelect, inquiryAgree, inquiryCheck, inquirySubmit, rolling
------------------------------------------------------------------------ */
// inquiry.html - 셀렉트박스 옵션
const inquirySelect = () => {
    const $product = get('.inquiry .inquirys .write .input1 #products');
    const $industryType = get('.inquiry .inquirys .write .input2 #industryTypes');
    const $inquiry = get('.inquiry .inquirys .write .input2 #inquirys');
    products.forEach((item) => {
        let option = document.createElement('option');
        option.setAttribute('value', item.value);
        option.innerHTML = item.name;
        $product.appendChild(option);
    });
    industryTypes.forEach((item) => {
        let option = document.createElement('option');
        option.setAttribute('value', item.value);
        option.innerHTML = item.name;
        $industryType.appendChild(option);
    });
    inquirys.forEach((item) => {
        let option = document.createElement('option');
        option.setAttribute('value', item.value);
        option.innerHTML = item.name;
        $inquiry.appendChild(option);
    });
};
// inquiry.html - 전체동의 체크
const inquiryAgree = () => {
    const $personal = get('.inquiry .inquirys .write .agree .chkbox .personalInfo');
    const $marketing = get('.inquiry .inquirys .write .agree .chkbox .marketing');
    $personal.innerHTML = terms[0].desc;
    $marketing.innerHTML = terms[2].desc;
    const $chks = getAll('.inquiry .inquirys .write .agree .chkbox input[type=checkbox]');
    const $chk = getAll('.inquiry .inquirys .write .agree .chkbox .chk');
    let isChecked = true;
    $chks.forEach((check) => {
        check.addEventListener('click', (e) => {
            isChecked = true;
            if (check.name === 'all') {
                $chks.forEach((chk1) => {
                    chk1.checked = all.checked;
                });
            }
            $chk.forEach((chk2) => {
                isChecked = chk2.checked && isChecked;
            });
            all.checked = isChecked;
        });
    });
};
// inquiry.html - 유효성검사
const inquiryCheck = () => {
    const $name = get('.inquiry .inquirys .write .input1 #userName');
    const $company = get('.inquiry .inquirys .write .input1 #companyName');
    const $email = get('.inquiry .inquirys .write .input1 #userEmail');
    const $tel = get('.inquiry .inquirys .write .input2 #phone');
    const $position = get('.inquiry .inquirys .write .input2 #position');
    const $select1 = get('.inquiry .inquirys .write .input1 #products');
    const $select2 = get('.inquiry .inquirys .write .input2 #industryTypes');
    const $select3 = get('.inquiry .inquirys .write .input2 #inquirys');
    const $chkbox = get('.inquiry .inquirys .write .agree .chkbox #chk1');
    if ($name.value === '') {
        alert('이름을 입력해 주세요.');
        $name.focus();
    } else if ($company.value === '') {
        alert('회사명 또는 단체명을 입력해 주세요.');
        $company.focus();
    } else if ($email.value.indexOf('@') === -1 || $email.value.split('@')[1].indexOf('.') === -1) {
        alert('이메일 형식이 올바르지 않습니다.');
        $email.focus();
    } else if ($tel.value === '') {
        alert('전화번호를 입력해 주세요.');
        $tel.focus();
    } else if ($position.value === '') {
        alert('직책을 입력해 주세요.');
        $position.focus();
    } else if ($select1.value === '') {
        alert('직책을 입력해 주세요.');
        $select1.focus();
    } else if ($select2.value === '') {
        alert('직책을 입력해 주세요.');
        $select2.focus();
    } else if ($select3.value === '') {
        alert('직책을 입력해 주세요.');
        $select3.focus();
    } else if ($chkbox.checked == false) {
        alert('개인정보 이용에 동의해주세요.');
        $chkbox.focus();
        return false;
    } else {
        alert('제출이 완료되었습니다.');
        window.location.replace('./inquiry.html');
    }
};
// inquiry.html - 제출버튼
const inquirySubmit = () => {
    const $btn = get('.inquiry .inquirys .btn button');
    $btn.addEventListener('click', (e) => {
        inquiryCheck();
    });
};
// inquiry.html - 하단 협력사 배너 무한 롤링
const rolling = () => {
    const $rollingBanner = get('.inquiry .rollingBanner');
    const $logos = get('.inquiry .rollingBanner .logos');
    const $logosUl = get('.inquiry .rollingBanner .logos ul');
    let clone = $logos.cloneNode(true);
    $rollingBanner.appendChild(clone);
    $logos.style.left = '0px';
    clone.style.left = $logosUl;
    $logos.classList.add('original');
    clone.classList.add('clone');
};

// 국제전화코드 플러그인(공통)
const tel = () => {
    var input = document.querySelector('#phone');

    var iti = window.intlTelInput(input, {
        nationalMode: false,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/utils.js',
        initialCountry: 'kr',
    });
    input.addEventListener('change', function () {
        var selectedCountryData = iti.getSelectedCountryData();
        console.log('국가 코드:', selectedCountryData.iso2);
        console.log('전화번호:', iti.getNumber());
    });
};

//서브페이지 별 함수 호출
const cargo = () => {
    cargoBanner();
    solCommon();
};

const iot = () => {
    iotBanner();
    iotScroll();
    solCommon();
};
const port = () => {
    solCommon();
};
const ship = () => {
    solCommon();
};

const blog = () => {
    blogList();
};
const blogSub = () => {
    blogGoToPage();
};
const eventOn = () => {
    eventListOn();
};
const eventFin = () => {
    eventListFin();
};

const price = () => {
    rollingTxt();
    priceAni();
};
const guide = () => {
    guideList();
};
const faq = () => {
    faqPage();
};
const login = () => {
    imgSlide();
    loginForm();
    saveId();
};
const signup = () => {
    signUpAgree();
    signUpSelect();
    signUpSubmit();
    tel();
};
const inquiry = () => {
    inquirySelect();
    inquiryAgree();
    inquirySubmit();
    rolling();
    tel();
};

const subInit = () => {
    if (location.pathname.split('/').pop() === 'cargo.html') {
        cargo();
    }
    if (location.pathname.split('/').pop() === 'iot.html') {
        iot();
    }
    if (location.pathname.split('/').pop() === 'port.html') {
        port();
    }
    if (location.pathname.split('/').pop() === 'ship.html') {
        ship();
    }
    if (location.pathname.split('/').pop() === 'blog.html') {
        blog();
    }
    if (location.pathname.split('/').pop() === 'blogPost.html') {
        blogSub();
    }
    if (location.pathname.split('/').pop() === 'eventOn.html') {
        eventOn();
    }
    if (location.pathname.split('/').pop() === 'eventFin.html') {
        eventFin();
    }
    if (location.pathname.split('/').pop() === 'guide.html') {
        guide();
    }
    if (location.pathname.split('/').pop() === 'price.html') {
        price();
    }
    if (location.pathname.split('/').pop() === 'faq.html') {
        faq();
    }
    if (location.pathname.split('/').pop() === 'login.html') {
        login();
    }
    if (location.pathname.split('/').pop() === 'signup.html') {
        signup();
    }
    if (location.pathname.split('/').pop() === 'inquiry.html') {
        inquiry();
    }
};

(() => {
    subInit();
})();
