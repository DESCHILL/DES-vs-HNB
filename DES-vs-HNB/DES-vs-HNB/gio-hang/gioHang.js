    /*
      Ghi chú :
      - File này là demo frontend .
      - Các phần: thêm/xóa/thay đổi số lượng đều xử lý ở JS phía client; phải thay đổi khi làm backend
      _Code đang demo không dụng linh tinh
    */

    // Khóa lưu localStorage cho demo
    const KHOA = 'gio_demo_v1';

    // Danh mục mẫu (chỉ demo)
    const danhMuc = [
      {id: 'p1', title: 'iPhone 17 Pro 256GB', price: 32990000, img: 'images/iphone17.jpg'},
      {id: 'p2', title: 'AirPods Pro 2', price: 4990000, img: 'images/airpodpro.jpg'},
      {id: 'p3', title: 'Cáp sạc Type-C', price: 190000, img: 'https://via.placeholder.com/160x120?text=C%E1%BA%A1p'}
    ];

    // Hàm đọc giỏ hàng từ localStorage
    function taiGio(){
      try{ return JSON.parse(localStorage.getItem(KHOA)) || [] }catch(e){return []}
    }

    // Hàm lưu giỏ hàng vào localStorage và render lại giao diện
    function luuGio(gio){ localStorage.setItem(KHOA, JSON.stringify(gio)); renderTatCa(); }

    // Format số sang VND
    function dinhDangVND(n){ return n.toLocaleString('vi-VN') + '₫' }

    // Render toàn bộ (nội dung trang giỏ)
    function renderTatCa(){
      const gio = taiGio();
      renderNoiDung(gio);
    }

    // Render nội dung chính: nếu rỗng hiển thị trạng thái rỗng, ngược lại hiển thị danh sách
    function renderNoiDung(gio){
      const el = document.getElementById('noidung');
      if(!gio || gio.length===0){
        el.innerHTML = `
          <div class="gio-rong">
            <div class="ikon">
              <!-- Icon giỏ hàng lớn hơn, hoàn chỉnh hơn: có phần thân, tay cầm và bánh xe -->
              <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g fill="none" stroke="#9ca3af" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 18h34l-4 22H22z" />
                  <path d="M24 18l-2-6H12" />
                  <circle cx="28" cy="46" r="3" fill="#9ca3af" stroke="none"/>
                  <circle cx="44" cy="46" r="3" fill="#9ca3af" stroke="none"/>
                </g>
              </svg>
            </div>
            <h2>Giỏ hàng của bạn chưa có sản phẩm nào!</h2>
            <p>Hãy thêm sản phẩm vào giỏ để tiếp tục. Hỗ trợ: <a >0877781362</a> (08h00 - 22h00)</p>
          </div>
        `;
        return;
      }

      // Nếu có sản phẩm, build HTML danh sách
      let htmlMatHang = '';
      let tong = 0;
      gio.forEach(it => {
        const tien = it.soLuong * it.gia;
        tong += tien;
        htmlMatHang += `
          <div class="hang-gio" data-id="${it.id}">
            <div class="anh"><img src="${it.img}" alt="${it.title}" style="max-width:100%;height:100%;object-fit:cover;border-radius:8px"/></div>
            <div class="thong-tin">
              <div class="tieu-de-item">${it.title}</div>
              <div class="meta-item">Mã: ${it.id} • ${dinhDangVND(it.gia)}</div>
            </div>
            <div style="text-align:right">
              <div class="dieu-khien-sl">
                <button class="giam">-</button>
                <input type="number" class="so-luong" min="1" value="${it.soLuong}" />
                <button class="tang">+</button>
              </div>
              <div style="margin-top:8px" class="gia">${dinhDangVND(tien)}</div>
              <div><button class="xoa">Xóa</button></div>
            </div>
          </div>
        `;
      });

      el.innerHTML = `
        <div class="luoi-gio">
          <div class="danh-sach-gio">
            <h2 style="margin:0 0 12px">Sản phẩm trong giỏ (${gio.length})</h2>
            ${htmlMatHang}
            <div style="padding:12px;color:var(--muted);font-size:13px">Bạn có thể thay đổi số lượng hoặc xóa sản phẩm.</div>
          </div>
          <aside class="tom-tat">
            <h3>Tóm tắt đơn hàng</h3>
            <div class="dong"><div>Tiền hàng</div><div>${dinhDangVND(tong)}</div></div>
            <div class="dong"><div>Phí giao hàng</div><div>Miễn phí</div></div>
            <div class="dong"><div>Ưu đãi</div><div>-0₫</div></div>
            <div class="dong" style="font-weight:700"><div>Tổng thanh toán</div><div>${dinhDangVND(tong)}</div></div>
            <div style="margin-top:12px">
              <input id="maGiamGia" placeholder="Mã khuyến mãi" style="width:100%;padding:10px;border-radius:8px;border:1px solid #e6e7eb" />
              <div class="thanh-toan">
                <button class="nut nut-chinh" id="nutThanhToan">Thanh toán</button>
                <button class="nut nut-ghost" id="tiepTucMua">Tiếp tục mua</button>
              </div>
            </div>
          </aside>
        </div>
      `;

      // Gán sự kiện cho từng item (tăng/giảm/sửa/xóa)
      document.querySelectorAll('.hang-gio').forEach(node => {
        const id = node.dataset.id;
        node.querySelector('.tang').addEventListener('click', ()=>thayDoiSoLuong(id,1));
        node.querySelector('.giam').addEventListener('click', ()=>thayDoiSoLuong(id,-1));
        node.querySelector('.so-luong').addEventListener('change', (e)=>datSoLuong(id, Math.max(1, parseInt(e.target.value)||1)));
        node.querySelector('.xoa').addEventListener('click', ()=>{ xoaMatHang(id) });
      });

      document.getElementById('nutThanhToan').addEventListener('click', ()=>thanhToan());
      document.getElementById('tiepTucMua').addEventListener('click', ()=>alert('Chuyển về trang sản phẩm (demo)'));
    }

    // Các hàm thao tác giỏ
    function themMatHang(pid, soLuong=1){
      const p = danhMuc.find(x=>x.id===pid);
      if(!p) return;
      const gio = taiGio();
      const found = gio.find(x=>x.id===pid);
      if(found) found.soLuong += soLuong; else gio.push({id:p.id,title:p.title,gia:p.price,img:p.img,soLuong});
      luuGio(gio);
    }
    function thayDoiSoLuong(id, delta){
      const gio = taiGio();
      const it = gio.find(x=>x.id===id); if(!it) return;
      it.soLuong = Math.max(1, it.soLuong + delta);
      luuGio(gio);
    }
    function datSoLuong(id, soLuong){
      const gio = taiGio(); const it = gio.find(x=>x.id===id); if(!it) return; it.soLuong = soLuong; luuGio(gio);
    }
    function xoaMatHang(id){
      let gio = taiGio(); gio = gio.filter(x=>x.id!==id); luuGio(gio);
    }
    function xoaToanBo(){ localStorage.removeItem(KHOA); renderTatCa(); }
    function thanhToan(){ const gio = taiGio(); if(gio.length===0){ alert('Giỏ hàng trống'); return } alert('Chức năng thanh toán demo — tổng: '+ dinhDangVND(gio.reduce((s,i)=>s+i.soLuong*i.gia,0))); }

    // Khi bấm nút Giỏ hàng bên header: chuyển tới trang giỏ ,chú ý code html cũng chưa thay đổi phần này
    document.getElementById('btnGio').addEventListener('click', function(e){
      // e.preventDefault();
      // document.getElementById('noidung').scrollIntoView({behavior: 'smooth'});
    });

    // Nút Tài khoản: ví dụ mở modal hoặc chuyển trang, ở đây để demo
    document.getElementById('btnTK').addEventListener('click', function(e){
      // e.preventDefault();
      alert('Chức năng Tài khoản (demo)');
    });

    // Khởi tạo demo: thêm một vài sản phẩm nếu giỏ rỗng (bỏ đoạn này nếu bạn muốn trang bắt đầu rỗng)
    (function khoiTaoDemo(){
      const g = taiGio();
      if(g.length===0){
        themMatHang('p1',1);
        themMatHang('p2',2);
      } else renderTatCa();
    })();