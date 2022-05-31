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
              Hoàn thành
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
          <el-card class="el-card">
            <span slot="header">Tên vườn đăng ký</span>
            <el-form-item
              prop="name"
            >
              <el-input v-model="farmForm.name" placeholder="Tên vườn"/>
            </el-form-item>
          </el-card>
          <el-card class="el-card">
            <span slot="header">Địa chỉ</span>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="province" label="Cấp tỉnh" tabindex="2">
                  <el-autocomplete
                    ref="inputProvince"
                    v-model="farmForm.province.name"
                    class="el-autocomplete"
                    placeholder="Cấp tỉnh"
                    value-key="name"
                    :fetch-suggestions="fetchProvinceSuggestions"
                    @select="handleSelectProvince"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="district" label="Cấp huyện" tabindex="3">
                  <el-autocomplete
                    ref="inputFarmDistrict"
                    v-model="farmForm.district.name"
                    class="el-autocomplete"
                    value-key="name"
                    placeholder="Cấp huyện"
                    :fetch-suggestions="fetchDistrictSuggestions"
                    @focus="focusDistrict"
                    @select="handleSelectDistrict"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="ward" label="Cấp xã" tabindex="4">
                  <el-autocomplete
                    ref="inputFarmWard"
                    v-model="farmForm.ward.name"
                    class="el-autocomplete"
                    value-key="name"
                    placeholder="Cấp xã"
                    :fetch-suggestions="fetchWardSuggestions"
                    @select="handleSelectWard"
                    @focus="focusWard"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item prop="detailAddress" label="Vị trí cụ thể" tabindex="5">
                <el-input v-model="farmForm.detailAddress" placeholder="Vị trí cụ thể"/>
              </el-form-item>
            </el-row>
          </el-card>
        </el-form>

        <div v-show="currentActiveStep === 2" style="text-align: center; margin-top: -30px">
          <el-result
            icon="success"
            title="Đăng ký thành công"
            sub-title="Nếu bạn cần một người hướng dẫn, một mentor để hỗ trợ bạn phát triển khu vườn, hãy đăng ký trong mục quản lý">
            <template slot="extra">
              <el-button type="primary" size="medium" icon="el-icon-right" @click="handleRouteToFarm">Đi tới khu vực
                quản lý
              </el-button>
            </template>
          </el-result>
        </div>
      </div>
      <el-button
        v-show="currentActiveStep !== 2"
        type="primary"
        style="margin-top: 20px; float: right"
        :loading="buttonNextStepLoading"
        @click="handleNextStep">Bước tiếp
        <i class="el-icon-arrow-right el-icon-right"></i>
      </el-button>
    </el-card>
  </el-card>
</template>

<script>
import {createFarm} from "@/api/farm";
import {searchDistricts, searchProvinces, searchWards} from "@/api/address";
import {mapGetters} from "vuex";
import {resetRouter} from "@/router";

export default {
  name: 'Index',
  data() {
    return {
      currentActiveStep: 1,
      activeNames: [],
      farmForm: {
        name: '',
        detailAddress: '',
        province: {
          name: ''
        },
        district: {
          name: ''
        },
        ward: {
          name: ''
        },
        descriptions: [
          {
            label: '',
            value: ''
          }
        ]
      },
      farmFormRules: {
        name: [
          {required: true, validator: this.validateName}
        ],
        province: [
          {validator: this.checkProvince}
        ],
        district: [
          {validator: this.checkDistrict}
        ],
        ward: [
          {validator: this.checkWard}
        ]
      },
      buttonNextStepLoading: false
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  methods: {
    handleNextStep() {
      if (this.currentActiveStep < 2) {
        if (this.currentActiveStep === 1) {
          this.$refs['farmForm'].validate(valid => {
            if (valid) {
              this.buttonNextStepLoading = true
              this.handleCreateFarm()
                .then(data => {
                  this.currentActiveStep++
                  console.log('created farm, ', data)
                  if (!this.roles.includes('farmer')) {
                    this.$store.dispatch('user/changeRoles')
                  }
                })
                .catch(err => {
                  this.$message.error('Đăng ký vườn không thành công, vui lòng thử lại sau')
                  console.log(err)
                })
                .finally(() => {
                  this.buttonNextStepLoading = false
                })
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
    checkProvince: function (rule, value, callback) {
      if (value.id === undefined) {
        callback(new Error('Tỉnh là thông tin bắt buộc'))
      } else {
        callback()
      }
    },
    checkDistrict: function (rule, value, callback) {
      if (value.id === undefined) {
        callback(new Error('Huyện là thông tin bắt buộc'))
      } else {
        callback()
      }
    },
    checkWard: function (rule, value, callback) {
      if (value.id === undefined) {
        callback(new Error('Xã là thông tin bắt buộc'))
      } else {
        callback()
      }
    },
    handleCreateFarm() {
      const descriptions = this.farmForm.descriptions.reduce((obj, current) => {
        if (current.label.trim().length > 0 && current.value.trim().length > 0) {
          obj[current.label] = current.value
        }
        return obj
      }, {})
      const farmDataSubmit = {
        name: this.farmForm.name,
        province: {
          id: this.farmForm.province.id
        },
        district: {
          id: this.farmForm.district.id
        },
        ward: {
          id: this.farmForm.ward.id
        },
        detailAddress: this.farmForm.detailAddress,
        descriptions: descriptions
      }
      console.log('send farm form creation, ', farmDataSubmit)
      return new Promise((resolve, reject) => {
        createFarm(farmDataSubmit)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    },
    handleRouteToFarm() {
      this.$router.push('/farm')
    },
    fetchProvinceSuggestions(name, cb) {
      searchProvinces(name)
        .then(data => {
          cb(data)
        })
    },
    fetchDistrictSuggestions(name, cb) {
      const provinceId = this.farmForm.province.id
      if (provinceId === undefined) {
        return
      }
      searchDistricts(provinceId, name)
        .then(data => {
          cb(data)
        })
    },
    fetchWardSuggestions(name, cb) {
      const districtId = this.farmForm.district.id
      if (districtId === undefined) {
        return
      }
      searchWards(districtId, name)
        .then(data => {
          cb(data)
        })
    },
    focusDistrict() {
      if (this.farmForm.province.id === undefined) {
        this.$message.warning('Vui lòng chọn Tỉnh trước')
        this.$refs['inputFarmDistrict'].$refs.input.blur()
      }
    },
    focusWard() {
      if (this.farmForm.province.id === undefined) {
        this.$message.warning('Vui lòng chọn Tỉnh')
        this.$refs['inputFarmWard'].$refs.input.blur()
      } else if (this.farmForm.district.id === undefined) {
        this.$message.warning('Vui lòng chọn Huyện')
        this.$refs['inputFarmWard'].$refs.input.blur()
      }
    },
    handleSelectProvince(province) {
      this.farmForm.province = province
      console.log('select province, ', province)
      this.farmForm.district = {name: ''}
      this.farmForm.ward = {name: ''}
    },
    handleSelectDistrict(district) {
      this.farmForm.district = district
      console.log('select district, ', district)
      this.farmForm.ward = {name: ''}
    },
    handleSelectWard(ward) {
      this.farmForm.ward = ward
      console.log('select ward, ', ward)
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-bottom: 15px;
}

.el-autocomplete {
  display: block;
}
</style>
