import moment from 'moment'
import conDau from '../../assets/asign.jpg'

const ContractTemplate = ({ contract, user }) => {
  return (
    <div style={{ padding: 20, display: 'flex' }}>
      <div style={{ paddingRight: 30, flex: 1 }}>
        <b>
          <center>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</center>
        </b>
        <b>
          <center>ĐỘC LẬP - TỰ DO - HANH PHÚC</center>
        </b>
        <br />
        <h4>
          <b>
            <center>HỢP ĐỒNG VAY TIỀN</center>
          </b>
        </h4>

        <h4>
          <b>Thông tin cơ bản về khoản vay</b>
        </h4>
        <p>Bên A (Bên cho vay): TỔNG CÔNG TY TÀI CHÍNH DẦU KHÍ PVFC</p>
        <p>
          Bên B (Bên vay) Ông / Bà: {user?.kyc?.name}
          <br />
          Số CMT / CCCD: {user?.kyc?.id_number}
          <br />
          Ngày đăng ký: {moment(contract?.created_at).format('hh:mm A DD/MM/YYYY')}
          <br />
          Số tiền khoản vay: {contract?.amount?.toLocaleString()} VNĐ
          <br />
          Thời gian vay: {contract?.times} tháng
          <br />
          Mã hợp đồng: {contract?.slug}
          <br />
          Lãi suất cho vay là 1.1% mỗi tháng
          <br />
          Lãi suất cho vay là 13.3% mỗi năm
        </p>
        <h4>
          <b>I. Phương thức trả nợ hàng tháng</b>
        </h4>
        <p>
          Chuyển khoản qua hệ thống ngân hàng điện tử: Momo, ViettelPay, Banking, các điểm giao dịch
          như; Viettel Store, Thế giới di dộng Bưu điện
        </p>
        <p>
          CHÚ Ý: Bên vay phải trả nợ gốc và lãi trong thời gian quy định hợp đồng. Đối với phần quá
          hạn, người cho vay có quyền thu hồi nợ trong thời hạn và thu (lãi quá hạn) % trên tổng số
          tiền vay trong ngày. Gốc và lãi của mỗi lần trả nợ sẽ được hệ thống tự động chuyển từ tài
          khoản ngân hàng do bên B bảo lưu sang tài khoản ngân hàng của bên A. Bên B phải đảm bảo có
          đủ tiền trong tài khoản ngân hàng trước ngày trả nợ hàng tháng.
        </p>
        <p>
          Hợp đồng nêu rõ các bên đã đạt được thỏa thuận vay sau khi thương lượng và trên cơ sở bình
          đẳng, tự nguyện và nhất trí. Tất cả các bên đã đọc kỹ tất cả các điều khoản trong thỏa
          thuận này, sau khi ký vào thỏa thuận này coi như các bên đã hiểu đầy đủ và đồng ý hoàn
          toàn với tất cả các điều khoản và nội dung trong thỏa thuân này.
        </p>
        <p>
          Phù hợp với các nguyên tắc bình đẳng, tự nguyện, trung thực và uy tín, hai bên thống nhất
          ký kết hợp đồng vay sau khi thương lượng và cùng cam kết thực hiện.
        </p>
        <h4>
          <b>II. Điều khoản đảm bảo</b>
        </h4>
        <p>
          Điều kiện 1: Bên vay không được sử dụng tiền vay để thực hiện các hoạt động bất hợp pháp.
          Nếu không, bên A có quyền yêu cầu bên B hoàn trả ngay tiền gốc và lãi, bên B phải chịu các
          trách nhiêm pháp lý phát sinh từ đó.
        </p>
        <p>
          Trường hợp bên vay có tài sản có giá trị để đảm bảo khoản vay như (nhà, đất, căn hộ, ô
          tô): Yêu cầu bên vay cung cấp hình ảnh giấy tờ tài sản đứng tên chính chủ sỡ hữu (Lưu ý:
          Cung cấp giấy tờ hình ảnh bản chính, chưa thế chấp, cầm cố tại đơn vị tín dụng, ngân hàng
          khác)
        </p>
      </div>
      <div style={{ flex: 1 }}>
        <h4>
          <b>III. Chịu trách nhiệm do vi phạm hợp đồng</b>
        </h4>
        <p>
          Tất cả các bên trong hợp đồng sẽ thực hiện nghiêm túc các nghĩa vụ của mình theo hợp đồng
          vay, không bên nào được chấm dứt thỏa thuận này trừ khi hai bên cùng đồng ý. Nếu một trong
          hai bên vi phạm hợp đồng, bên vi phạm sẽ chịu chi phí kiện tụng, phí luật sư và các chi
          phí phát sinh khác. Lưu ý: Sau khi khách hàng xác nhận khoản vay kí hợp đồng và nộp hồ sơ
          lên hệ thống đồng nghĩa với việc khách hàng đã đồng ý với tất cả điều khoản trong hợp
          đồng. Hợp đồng vay chính thức có hiệu lực, lãi suất đã có lịch sử thanh toán hàng tháng và
          bắt đầu được tính. Nếu bên vay ký hợp đồng mà không thực hiện được đúng các điều khoản
          trong hợp đồng sẽ bị coi là vi phạm hợp đồng và sẽ bị xử lý theo các quy định nêu trên và
          truy cứu trách nhiệm hành sự, lừa đảo chiếm đoạt tài sản. Hợp đồng đã có hiệu lực kể từ
          ngày ký, Bên B hoàn trả đầy đủ gốc và lãi sẽ được thanh lý. 1) Tất cả chi phí khác phát
          sinh theo hợp đồng này. 2) Giám sát phí quản lý tài khoản quá hạn 100.000 VNĐ. 3) Lãi quá
          hạn quy định 150.000 VNĐ /1 ngày quá hạn (trả chậm). 4) Phí quản lý tài khoản khoản vay
          50.000 VNĐ. 5) Vi phạm hợp đồng lãi suất %/1 tháng.) Phí bồi thường khi chấm dứt hợp đồng
          và hủy bỏ hợp đồng = 50% số tiền vay. 7) Các thủ tục giấy tờ và phí luật sư trong trường
          hợp và cách giải quyết vấn đề mà bên xử lý đưa ra.
        </p>
        <p>
          Phương thức giải quyết tranh chấp hợp đồng. <br /> Tranh chấp phát sinh trong quá trình
          thực hiện hợp đồng này sẽ được giải quyết thông qua thương lượng thân thiện giữa các bên
          hoặc có thể nhờ bên thứ ba làm trung gian hòa giải. Nếu thương lượng hoặc hòa giải không
          thành, có thể khởi kiện ra tòa án nhân dân nơi bên A có trụ sở.
        </p>
        <p>
          Khi người vay trong quá trình xét duyệt khoản vay không thành công do nhiều yếu tố khác
          nhau như CMND/CCCD sai, thẻ ngân hàng sai, danh bạ sai. Việc thông tin sai lệch này sẽ
          khiến hệ thống phát hiện nghi ngờ gian lận hoặc giả mạo khoản vay và bên vay phải chủ động
          hợp tác với bên A để xử lý.
        </p>
        <p>
          Nếu không hợp tác. Bên A có quyền khởi kiện ra Tòa án nhân dân và trình báo lên Trung tâm
          Báo cáo tín dụng của Ngân hàng nhà nước Việt Nam, hồ sơ nợ xấu sẽ được phản ánh trong báo
          cáo tín dụng, ảnh hưởng đến tín dụng sau này của người vay vốn ngân hàng và hạn chế tiêu
          dùng, tín dụng của người thân, con cái người vay...
        </p>
        <h4>
          <b>IV. Bảo mật thông tin</b>
        </h4>
        <p>
          Để bảo mật thông tin của bên B, nghiêm cấm tuyệt đối bên thứ 3 có hành vi xâm nhập vào tự
          ý chỉnh sửa thông tin của bên B mọi hành vi trên điều vi phạm pháp luật nếu phát hiện sẽ
          được khởi tố trước pháp luật và nghiêm cấm tuyệt đối các hành vi, trường hợp mạo danh, sử
          dụng thông tin của người khác đăng ký khoản vay, nếu phát hiện sẽ bị khởi tố theo quy định
          của pháp luật.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Bên vay</p>
            <div>
              <img src={`${contract?.signature_capture}`} width="200px" alt="sign" />
              <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{user?.kyc?.name}</p>
            </div>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Bên cho vay</p>
            <p>
              <img src={conDau} width="240px" alt="sign" />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContractTemplate
