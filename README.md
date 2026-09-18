1. Bạn phân tích template và chia cấu trúc giao diện này như thế nào trước khi bắt đầu code?

Trước khi code, Em nhìn template theo từng nhóm nội dung và hành vi. Phần đầu là hero có hình ảnh và nội dung giới thiệu, tiếp theo là ticker chạy ngang, danh sách thương hiệu, rồi đến các card danh mục.

Em tách bố cục thành các section riêng để dễ kiểm soát CSS. Sau đó Em đánh dấu những phần có tương tác: hero slider, các dải nội dung chạy ngang, hiệu ứng card và animation khi section xuất hiện trong viewport. Em làm bố cục và nội dung cơ bản trước, rồi mới xử lý animation và responsive.

2. Bạn quyết định breakpoint/responsive dựa trên cơ sở nào?

Em dựa vào lúc bố cục bắt đầu bị chật thay vì chỉ chọn breakpoint theo tên thiết bị. Ở màn hình lớn, hero có thể chia hai cột và các card nằm trên một hàng. Khi màn hình hẹp hơn, hero chuyển thành một cột, các card chuyển sang lưới hai cột. Trên mobile, card được chuyển thành danh sách cuộn ngang để hình ảnh và chữ vẫn đủ rõ.

Em dùng các mốc chính khoảng `1024px` và `640px`, kết hợp với `clamp()` cho font, khoảng cách và chiều cao để giao diện chuyển đổi mềm hơn giữa các kích thước màn hình.

3. Trong quá trình làm, vấn đề khó nhất bạn gặp phải là gì và bạn xử lý như thế nào?

Phần khó nhất là các logic trong file JavaScript Hero slider phải tự chuyển slide theo thời gian, dừng lại khi người dùng rê chuột vào, dừng khi tab không còn hiển thị và chạy tiếp khi quay lại. Khi đổi slide, animation của ảnh và thanh tiến trình cũng phải được reset đúng lúc.

Ngoài ra, phần reveal cần kiểm tra section đã đi vào viewport hay chưa, còn ticker và danh sách thương hiệu phải tạo đủ bản sao để chuyển động liên tục mà không bị hụt khoảng trống. Em tách từng phần thành các hàm khởi tạo riêng, dùng `IntersectionObserver` cho những phần phụ thuộc vào viewport, còn timer của slider được quản lý tập trung để tránh tạo nhiều timer cùng lúc. Cuối cùng Em kiểm tra thêm trường hợp người dùng bật `prefers-reduced-motion` để tắt các chuyển động không cần thiết.

4. Bạn đã sử dụng AI ở những phần nào? AI giúp bạn giải quyết vấn đề gì?

Em sử dụng AI như một công cụ trao đổi và kiểm tra trong lúc làm, chủ yếu ở phần tổ chức CSS, responsive và các logic JavaScript như slider, autoplay

5. Có đề xuất nào từ AI mà bạn không sử dụng hoặc phải chỉnh sửa lại không? Vì sao?

Có. Ở phần JavaScript, Em cũng phải chỉnh lại một số đề xuất để phù hợp nhất là cách reset animation, quản lý timer và xử lý trạng thái khi người dùng chuyển tab.
