<template>
  <el-card style="height: 100%">
    <div slot="header">
      <span>Hoàn thành các bước để đăng ký vườn</span>
    </div>
    <el-card style="padding-bottom: 50px">
      <el-steps :active="currentActiveStep" align-center style="margin-bottom: 50px">
        <el-step title="Bước 1">
          <template slot="description">
            <span v-if="currentActiveStep===0">
              Hoàn thành các thông tin bản thân
            </span>
            <i v-else-if="currentActiveStep > 0" class="el-icon-check"/>
          </template>
        </el-step>
        <el-step title="Bước 2">
          <template slot="description">
            <span v-if="currentActiveStep===1">
              Hoàn thành các thông tin Vườn
            </span>
            <i v-else-if="currentActiveStep > 1" class="el-icon-check"/>
          </template>
        </el-step>
        <el-step title="Bước 3">
          <template slot="description">
            <span v-if="currentActiveStep===2">
              Chờ duyệt
            </span>
            <i v-else-if="currentActiveStep > 2" class="el-icon-check"/>
          </template>
        </el-step>
      </el-steps>

      <div>
        <div v-show="currentActiveStep===0">
          <h4>
            Xem xét việc chỉnh sửa thông tin cá nhân của bạn cho chính xác nhất để việc xét duyệt trở nên dễ dàng hơn
          </h4>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="Quản lý" name="1">
              <div>Khi bạn tham gia với chúng tôi, chúng tôi sẽ cung cấp cho bạn khả năng quản lý vườn của mình, cập
                nhật, theo dõi và đưa dữ liệu của vườn bạn hiển thị một cách tốt nhất
              </div>
              <div>Quản lý về thông tin vườn, mô tả, trồng mới, cập nhật số lượng cây trong vườn</div>
            </el-collapse-item>
            <el-collapse-item title="Hỗ trợ" name="2">
              <div>Với khu vườn của bạn một khi đăng ký thành công, vườn sẽ được hỗ trợ kỹ thuật từ một chuyên gia cây
                trồng
              </div>
              <div>Người chuyên gia cây trồng phụ trách hỗ trợ kỹ thuật cho vườn của bạn sẽ có nhiệm vụ giúp đỡ, tư vấn,
                hỗ trợ bạn khi bạn có nhu cầu cần hỗ trợ
              </div>
            </el-collapse-item>
            <el-collapse-item title="Phát triển du lịch" name="3">
              <div>Khi bạn đã có vườn, bạn có thể tạo các bài quảng cáo du lịch, tạo thêm các giá trị mới và giúp khách
                du lịch có được trải nghiệp là các hoạt động chăm sóc, trồng mới, thu hoạch sản phẩm.....
              </div>
              <div>Khi du khách tham gia các hoạt động, bạn cần phải thêm các du khách đó vào dữ liệu du lịch vườn, từ
                đó các du khách có thể thấy đóng góp của mình và sẽ có xu hướng quay trở về để tham gia tiếp
              </div>
              <div>Mỗi đợt như vậy, bạn có thể xem thống kê về du lịch và hoạt động của vườn bạn, bạn sẽ cảm thấy có
                thêm nhiều động lực hơn đó
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <el-form v-show="currentActiveStep === 1" ref="farmForm" :model="farmForm" :rules="farmFormRules">
          <el-form-item
            prop="name"
            label="Tên vườn đăng ký"
          >
            <el-input v-model="farmForm.name" placeholder="Tên vườn"/>
          </el-form-item>
          <el-form-item
            prop="address"
            label="Địa chỉ của vườn"
          >
            <el-input v-model="farmForm.address" placeholder="Địa chỉ"/>
          </el-form-item>
        </el-form>

        <div v-show="currentActiveStep === 2" style="text-align: center; margin-top: -30px">
          <el-result
            icon="success"
            title="Dữ liệu vườn mà bạn cung cấp đã được gửi lên và đang chờ xét duyệt"
            sub-title="Nếu sau 7 ngày mà vẫn chưa được duyệt, bạn có thể xem xét lý do tại hòm tin hoặc liên hệ trực tiếp với chúng tôi">
          </el-result>
        </div>
      </div>
      <el-button v-show="currentActiveStep !== 2" type="primary" style="margin-top: 20px; float: right"
                 @click="handleNextStep">Bước tiếp <i
        class="el-icon-arrow-right el-icon-right"></i></el-button>
    </el-card>
  </el-card>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      currentActiveStep: 0,
      activeNames: [],
      farmForm: {
        name: '',
        address: '',
        descriptions: [
          {
            label: '',
            value: ''
          }
        ]
      },
      farmFormRules: {
        name: [
          {required: true, validator: this.validateName, trigger: 'blur'}
        ],
        address: [
          {require: true, validator: this.validateAddress, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleNextStep() {
      if (this.currentActiveStep < 2) {
        if (this.currentActiveStep === 1) {
          this.$refs['farmForm'].validate(valid => {
            if (valid) {
              this.currentActiveStep++
              this.handleCreateFarm()
            } else {
              this.$message.warning('Vui lòng kiểm tra lại thông tin')
            }
          })
        } else {
          this.currentActiveStep++
        }
      } else {
        this.currentActiveStep = 0
      }
    },
    validateName(rule, currentValue, callback) {
      if (currentValue == null || currentValue.trim() < 8) {
        callback(new Error('Tên vườn không hợp lệ'))
      } else {
        callback()
      }
    },
    validateAddress(rule, currentValue, callback) {
      if (currentValue == null || currentValue.trim() < 3) {
        callback(new Error('Địa chỉ không hợp lệ'))
      } else {
        callback()
      }
    },
    handleCreateFarm() {
      console.log('create farm, ', this.farmForm)
    }
  }
}
</script>

<style scoped>

</style>
