// PDF.js worker'ı ayarla
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

let currentPage = 1;
let totalPages = 0;
let flipbook = null;

// PDF sayfalarını oluştur
async function createPDFPages() {
    try {
        // PDF'i yükle
        const loadingTask = pdfjsLib.getDocument('assets/presentation.pdf');
        const pdf = await loadingTask.promise;
        totalPages = pdf.numPages;
        
        // Sayfa sayısını göster
        document.getElementById('page-count').textContent = totalPages;
        document.getElementById('page-num').textContent = currentPage;

        // Her sayfayı işle
        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            
            // Canvas oluştur
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            // Sayfayı canvas'a çiz
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            // Canvas'ı sayfa olarak ekle
            const pageDiv = $('<div class="page"></div>');
            pageDiv.append(canvas);
            $('#flipbook').append(pageDiv);
        }

        // Flipbook'u başlat
        $('#flipbook').turn({
            width: 922,
            height: 600,
            autoCenter: true,
            duration: 1000,
            gradients: true,
            acceleration: true,
            elevation: 50,
            when: {
                turning: function(e, page, view) {
                    currentPage = page;
                    document.getElementById('page-num').textContent = currentPage;
                }
            },
            display: 'double',
            acceleration: true,
            elevation: 50,
            gradients: !$.isTouch,
            autoCenter: true,
            when: {
                turning: function(e, page, view) {
                    currentPage = page;
                    document.getElementById('page-num').textContent = currentPage;
                }
            }
        });

    } catch (error) {
        console.error('PDF yüklenirken hata oluştu:', error);
        alert('PDF yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
}

// Sayfa kontrolleri
function nextPage() {
    if (currentPage < totalPages) {
        $('#flipbook').turn('page', currentPage + 1);
    }
}

function previousPage() {
    if (currentPage > 1) {
        $('#flipbook').turn('page', currentPage - 1);
    }
}

// Video bitişini kontrol et
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('intro-video');
    const nextBtn = document.getElementById('video-next-btn');
    
    video.addEventListener('ended', function() {
        nextBtn.disabled = false;
    });
});

// Bölümler arası geçiş fonksiyonu
function showSection(sectionId) {
    // Tüm bölümleri gizle
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active-section');
        section.classList.add('hidden-section');
    });
    
    // İstenen bölümü göster
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden-section');
    targetSection.classList.add('active-section');
    
    // Eğer PDF bölümüne geçiliyorsa
    if (sectionId === 'pdf-section') {
        // Video bölümünü tamamen gizle
        document.getElementById('video-section').style.display = 'none';
        // PDF bölümünü tam ekran yap
        targetSection.style.height = '100vh';
        targetSection.style.overflow = 'hidden';
        // Flipbook'u başlat
        createPDFPages();
    }
    
    // Sayfayı bölümün başına kaydır
    targetSection.scrollIntoView({ behavior: 'smooth' });
}

// Form gönderimi
document.getElementById('evaluation-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Form verilerini al
    const formData = {
        name: document.getElementById('name').value,
        understanding: document.getElementById('understanding').value,
        feedback: document.getElementById('feedback').value
    };
    
    // Form verilerini konsola yazdır (gerçek uygulamada bu veriler bir sunucuya gönderilebilir)
    console.log('Form verileri:', formData);
    
    // Kullanıcıya geri bildirim
    alert('Değerlendirmeniz için teşekkür ederiz!');
    
    // Formu sıfırla
    this.reset();
}); 