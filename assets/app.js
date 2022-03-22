
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app= {
    currentIndex: 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name:'Muon Roi Ma Sao Con',
            singer: 'Son Tung M-TP',
            path: './assets/audio/MuonRoiMaSaoCon.mp3',
            image: './assets/img/muonroimasaocon.jpg'
        },
        {
            name:'Co Chac Yeu La Day',
            singer: 'Son Tung M-TP',
            path: './assets/audio/CoChacYeuLaDay.mp3',
            image: './assets/img/cochacyeuladay.jpg'
        },
        
        {
            name:'Em Cua Ngay Hom Qua',
            singer: 'Son Tung M-TP',
            path: './assets/audio/EmCuaNgayHomQua.mp3',
            image: './assets/img/emcuangayhomqua.jpg'
        },
        {
            name:'Hay Trao Cho Anh',
            singer: 'Son Tung M-TP',
            path: './assets/audio/HayTraoChoAnh.mp3',
            image: './assets/img/haytraochoanh.jpg'
        },
        {
            name:'Chay Ngay Di',
            singer: 'Son Tung M-TP',
            path: './assets/audio/ChayNgayDi.mp3',
            image: './assets/img/chayngaydi.jpg'
        },
        {
            name:'Chung Ta Cua Hien Tai',
            singer: 'Son Tung M-TP',
            path: './assets/audio/ChungTaCuaHienTai.mp3',
            image: './assets/img/chungtacuahientai.jpg'
        },
        {
            name:'An Nut Nho Tha Giac Mo',
            singer: 'Son Tung M-TP',
            path: './assets/audio/AnNutNhoThaGiacMo.mp3',
            image: './assets/img/annutnhothagiacmo.jpg'
        },
        {
            name:'Bua Yeu',
            singer: 'Bich Phuong',
            path: './assets/audio/BuaYeu.mp3',
            image: './assets/img/buayeu.jpg'
        },
        {
            name:'Chay Ve Noi Phia Anh',
            singer: 'Khac Viet',
            path: './assets/audio/ChayVeNoiPhiaAnh.mp3',
            image: './assets/img/chayvenoiphiaanh.jpg'
        }
    ],
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this=this
        // Xử lý quay CD
        const cdThumbAnimate = cdThumb.animate([
            {
                transform : 'rotate(360deg)'
            }
        ],
        {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //Xử lý phóng to/thu nhỏ CD
        const cdWidth = cd.offsetWidth

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth >0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            }
            
        }
        //Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //Khi song pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime /audio.duration*100)
                progress.value = progressPercent
            }

        }
        //Xu ly khi tua
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //Khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Khi Prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        
        //Random
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }

         //Repeat
         repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        //Xu ly next song kho audio ended
        audio.onended = function(){
            if( _this.isRepeat){
                audio.play()
            }
            else{
                nextBtn.click()
                }
        }

        //Lắng nghe click vào playlist
        playlist.onclick = function(e){
            // Xử lý khi click vào song
            const songNode = e.target.closest('.song:not(.active)')
            if(
                songNode || e.target.closest('.option')
                ){
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        _this.render()
                        audio.play()
                    }
            }
            //Xử lý khi click vào song option
            if(e.target.closest('.option')){

            }
        }
       
    },
    scrollToActiveSong: function(){
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        },300)
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        

    },
    nextSong :function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()

    },
    prevSong :function(){
        this.currentIndex--
        if(this.currentIndex < 0 ){
        this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()

    },
    playRandomSong :function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function(){
        //Gắn cấu hình từ config vào ứng dụng
        this.loadConfig()
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties()
        //Lắng nghe/ xử lý các sự kiện trong DOM
        this.handleEvents()
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        //Render playlist
        this.render()
        //Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    }
}
app.start()