// 页面加载动画
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载器
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        const progressBar = pageLoader.querySelector('.progress-bar');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    pageLoader.classList.add('hidden');
                    setTimeout(() => {
                        pageLoader.style.display = 'none';
                    }, 500);
                }, 300);
            }
            progressBar.style.transform = `translateX(${progress - 100}%)`;
        }, 50);
    }
    
    // 导航栏效果
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 导航链接高亮
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // 移动端菜单
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // 点击菜单项关闭菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const offset = 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 字符计数器
    const declarationTextarea = document.getElementById('declaration');
    const charCount = document.getElementById('charCount');
    
    if (declarationTextarea && charCount) {
        declarationTextarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
            
            if (this.value.length < 300) {
                this.style.borderColor = '#ff6b6b';
            } else if (this.value.length > 500) {
                this.style.borderColor = '#ffa726';
            } else {
                this.style.borderColor = '#27ae60';
            }
        });
    }
    
    // 表单提交
    const recruitForm = document.getElementById('recruitForm');
    const successModal = document.getElementById('successModal');
    
    if (recruitForm) {
        recruitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 验证宣言字数
            const declaration = document.getElementById('declaration').value;
            if (declaration.length < 300) {
                alert('传承宣言需要至少300字，请详细描述您的理想与初心。');
                return;
            }
            
            // 收集表单数据
            const formData = {
                name: document.getElementById('name').value,
                age: document.getElementById('age').value,
                education: document.getElementById('education').value,
                background: document.getElementById('background').value,
                declaration: declaration,
                contact: document.getElementById('contact').value,
                timestamp: new Date().toLocaleString('zh-CN')
            };
            
            // 保存到localStorage（模拟提交）
            localStorage.setItem('tianyi_application', JSON.stringify(formData));
            
            // 显示成功模态框
            if (successModal) {
                successModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            // 重置表单
            recruitForm.reset();
            if (charCount) charCount.textContent = '0';
        });
    }
    
    // 模态框关闭
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // 点击背景关闭模态框
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });
    
    // 卡片动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    document.querySelectorAll('.vision-item, .recruit-card, .timeline-content, .feature-item, .partner-card, .plan-step').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // ===========================================
    // 增强的视频播放控制 - 解决移动端问题
    // ===========================================
    const tcmVideo = document.getElementById('tcmVideo');
    const videoPlayBtn = document.getElementById('videoPlayBtn');
    const videoOverlay = document.querySelector('.video-overlay');
    const videoLoading = document.getElementById('videoLoading');
    const retryVideoBtn = document.querySelector('.retry-video-btn');
    
    if (tcmVideo) {
        let videoLoaded = false;
        let videoError = false;
        
        // 显示加载状态
        const showLoading = () => {
            if (videoLoading) {
                videoLoading.classList.add('active');
            }
        };
        
        // 隐藏加载状态
        const hideLoading = () => {
            if (videoLoading) {
                videoLoading.classList.remove('active');
            }
        };
        
        // 显示错误状态
        const showError = () => {
            videoError = true;
            hideLoading();
            // 视频错误时显示备用方案
            const videoFallback = tcmVideo.querySelector('.video-fallback');
            if (videoFallback) {
                videoFallback.style.display = 'flex';
            }
        };
        
        // 隐藏错误状态
        const hideError = () => {
            videoError = false;
            const videoFallback = tcmVideo.querySelector('.video-fallback');
            if (videoFallback) {
                videoFallback.style.display = 'none';
            }
        };
        
        // 重试播放视频
        const retryVideo = () => {
            hideError();
            showLoading();
            videoLoaded = false;
            
            // 重新加载视频
            tcmVideo.load();
            
            // 延迟播放，确保加载完成
            setTimeout(() => {
                tcmVideo.play().catch(() => {
                    showError();
                });
            }, 500);
        };
        
        // 播放按钮点击事件（增强）
        if (videoPlayBtn) {
            // 先移除旧的监听器（如果存在），再添加新的
            videoPlayBtn.replaceWith(videoPlayBtn.cloneNode(true));
            const newVideoPlayBtn = document.getElementById('videoPlayBtn');
            
            newVideoPlayBtn.addEventListener('click', function() {
                if (videoError) {
                    retryVideo();
                    return;
                }
                
                showLoading();
                tcmVideo.play().then(() => {
                    videoOverlay.classList.add('hidden');
                    hideLoading();
                }).catch(error => {
                    console.error('视频播放失败:', error);
                    showError();
                });
            });
        }
        
        // 重试按钮
        if (retryVideoBtn) {
            retryVideoBtn.addEventListener('click', retryVideo);
        }
        
        // 视频加载事件
        tcmVideo.addEventListener('loadeddata', function() {
            videoLoaded = true;
            hideLoading();
            console.log('视频加载完成');
        });
        
        // 视频加载中事件
        tcmVideo.addEventListener('waiting', function() {
            showLoading();
        });
        
        // 视频可以播放事件
        tcmVideo.addEventListener('canplay', function() {
            hideLoading();
        });
        
        // 视频错误事件
        tcmVideo.addEventListener('error', function(e) {
            console.error('视频加载错误:', tcmVideo.error);
            showError();
        });
        
        // 视频播放事件
        tcmVideo.addEventListener('play', function() {
            videoOverlay.classList.add('hidden');
            hideError();
        });
        
        // 视频暂停事件
        tcmVideo.addEventListener('pause', function() {
            if (!videoError) {
                videoOverlay.classList.remove('hidden');
            }
        });
        
        // 视频结束事件
        tcmVideo.addEventListener('ended', function() {
            if (!videoError) {
                videoOverlay.classList.remove('hidden');
                if (videoPlayBtn) {
                    videoPlayBtn.innerHTML = '<i class="fas fa-redo"></i>';
                }
            }
        });
        
        // 点击视频本身也可以播放
        tcmVideo.addEventListener('click', function() {
            if (videoError) {
                retryVideo();
                return;
            }
            
            if (tcmVideo.paused) {
                showLoading();
                tcmVideo.play().then(() => {
                    hideLoading();
                }).catch(error => {
                    console.error('视频播放失败:', error);
                    showError();
                });
            } else {
                tcmVideo.pause();
            }
        });
        
        // 移动端触摸事件支持
        tcmVideo.addEventListener('touchstart', function(e) {
            if (videoError) {
                retryVideo();
                e.preventDefault();
            }
        }, { passive: true });
        
        // 页面可见性变化时处理视频播放
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // 页面隐藏时暂停视频
                if (!tcmVideo.paused) {
                    tcmVideo.pause();
                }
            }
        });
    }
    // ===========================================
    // 视频播放控制结束
    // ===========================================
    
    console.log('天医传承网站初始化完成');
});

// 关闭模态框函数
function closeModal() {
    const modal = document.querySelector('.modal.active');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// 显示通知函数
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

document.head.appendChild(style);