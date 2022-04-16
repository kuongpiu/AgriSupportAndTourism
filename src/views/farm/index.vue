<template>
  <el-card style="padding-bottom: 100px">
    <router-link to="/create-farm">
      <el-button
        style="float: right"
        size="small"
        type="success"
        icon="el-icon-folder-add">
        Thêm vườn
      </el-button>
    </router-link>
    <div v-if="hasFarm">
      <div style="clear: both">
        <el-tabs v-model="activeFarm">
          <el-tab-pane
            v-for="(farm, index) in farms"
            :key="farm.id"
            :label="'Vườn thứ ' +(index + 1)"
            :name="index.toString()"
          />
        </el-tabs>
      </div>
      <el-card>
        <div slot="header">
          <span>{{ currentFarm.name }}</span>
          <div style="float: right">
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit">Sửa</el-button>
              <el-button type="danger" size="small" icon="el-icon-delete" @click="alertDelete">Xóa</el-button>
            </el-button-group>
          </div>
        </div>
        <farm-description :farm="currentFarm"/>
      </el-card>
      <div class="detail-info">
        <div class="chart-container">
          <span class="title">Cấu trúc</span>
          <pie-chart :key="pieChartKey" :data="farmStatistic" class="pie-chart"/>
        </div>
        <div class="activity-container">
          <drag-kanban/>
        </div>
      </div>
      <el-dialog
        v-if="formsHaveData"
        title="QUẢN LÝ THÔNG TIN"
        :visible.sync="dialogVisible"
        :fullscreen="false"
        :width="'80%'"
        :center="true"
        :top="'5vh'"
        :close-on-click-modal="false"
      >
        <el-row :gutter="30">
          <el-col :span="12">
            <el-card v-loading="loadingInfoFarm">
              <div slot="header">
                <span style="line-height: 30px"> <i style="color: #c7c738" class="el-icon-info scale-icon"/> Thông tin vườn </span>
                <div v-if="farmInfoFormHasChanged" style="float: right">
                  <el-button
                    v-loading="buttonResetLoading"
                    size="small"
                    style="color: #0e7450"
                    type="text"
                    icon="el-icon-refresh-left"
                    @click="handleResetFarmInfoForm"
                  >
                    Khôi phục
                  </el-button>
                  <el-button
                    v-loading="buttonSaveLoading"
                    size="small"
                    type="text"
                    icon="el-icon-check"
                    @click="handleSaveFarmInfoForm"
                  >Lưu
                  </el-button>
                </div>
              </div>
              <el-form
                ref="farmInfoForm"
                label-position="left"
                label-width="120px"
                :model="farmInfoForm"
                :rules="farmInfoFormRules"
                style="padding:0 10px"
              >
                <el-form-item label="Tên vườn" prop="name.content">
                  <el-input
                    v-if="farmInfoForm.name.inputVisible"
                    ref="farmName"
                    v-model="farmInfoForm.name.content"
                    @keyup.enter.native.prevent="farmInfoForm.name.inputVisible = false"
                    @blur="farmInfoForm.name.inputVisible = false"
                  />
                  <div v-else>
                    <span style="display: inline-block; line-height: 25px"> {{ farmInfoForm.name.content }} </span>
                    <span>
                    <el-button
                      icon="el-icon-edit"
                      round
                      plain
                      style="border: none;"
                      @click="showInput(farmInfoForm.name, 'farmName')"
                    />
                  </span>
                  </div>
                </el-form-item>
                <el-form-item label="Địa chỉ" prop="address.content">
                  <el-input
                    v-if="farmInfoForm.address.inputVisible"
                    ref="farmAddress"
                    v-model="farmInfoForm.address.content"
                    @keyup.enter.native.prevent="farmInfoForm.address.inputVisible = false"
                    @blur="farmInfoForm.address.inputVisible = false"
                  />
                  <div v-else>
                    <span style="display: inline-block; line-height: 25px"> {{ farmInfoForm.address.content }} </span>
                    <span>
                    <el-button
                      icon="el-icon-edit"
                      round
                      plain
                      style="border: none;"
                      @click="showInput(farmInfoForm.address, 'farmAddress')"
                    />
                  </span>
                  </div>
                </el-form-item>
                <el-form-item
                  v-for="(desc, index) in farmInfoForm.descriptions"
                  :key="index"
                  :prop="desc.label"
                >
                  <el-input
                    v-if="desc.inputLabelVisible"
                    v-model="desc.label"
                    class="el-label-input"
                    placeholder="Tên mục"
                    @keyup.enter.native.prevent="checkRemoveDescription(desc, index)"
                    @blur="checkRemoveDescription(desc, index)"
                  />
                  <span v-else slot="label">{{ desc.label }}</span>
                  <el-input
                    v-if="desc.inputVisible"
                    :ref="'desc' + index"
                    v-model="desc.content"
                    placeholder="Nội dung"
                    @keyup.enter.native.prevent="desc.inputVisible = false"
                    @blur="desc.inputVisible = false"
                  />
                  <span v-else>
                  {{ desc.content }}
                  <el-button
                    icon="el-icon-edit"
                    round
                    plain
                    style="border: none"
                    @click="showInput(desc, 'desc' + index, true)"
                  />
                </span>
                </el-form-item>
                <el-button type="text" size="small" icon="el-icon-plus" @click="handleInsertDescription">Bổ sung
                </el-button>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card :key="farmStructureKey">
              <div slot="header">
                <span style="line-height: 30px"> <i style="color: #52a7ff" class="el-icon-s-tools scale-icon"/> Cấu trúc vườn </span>
                <div v-if="farmStructureHasChanged" style="float: right">
                  <el-button
                    size="small"
                    style="color: #0e7450"
                    type="text"
                    icon="el-icon-refresh-left"
                    @click="handleResetFarmStructureForm"
                  >
                    Khôi phục
                  </el-button>
                  <el-button
                    size="small"
                    type="text"
                    icon="el-icon-check"
                    @click="handleSaveFarmStructureForm"
                  >
                    Lưu
                  </el-button>
                </div>
              </div>
              <div>
                <el-form :model="farmStructureForm" label-position="left">
                  <h4 style="margin-bottom: 15px">Loại cây</h4>
                  <el-form-item prop="types">
                    <el-tag
                      v-for="tree in farmStructureForm.types"
                      :key="tree"
                      closable
                      class="el-tag"
                      :disable-transitions="true"
                      @close="handleRemoveTree(tree)"
                    >
                      {{ tree }}
                    </el-tag>
                    <el-autocomplete
                      v-if="inputTreeVisible"
                      ref="saveTreeTagInput"
                      v-model="inputTree"
                      class="input-new-tag"
                      size="small"
                      :select-when-unmatched="true"
                      :fetch-suggestions="queryTreeSearch"
                      clearable
                      placeholder="Tên cây"
                      @select="handleInputTreeConfirm"
                      @clear="inputTreeVisible=false"
                    />
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      icon="el-icon-plus"
                      @click="showInputTree"
                    >
                      Thêm
                    </el-button>
                  </el-form-item>
                  <h4
                    v-if="farmStructureForm.numbers.length > 0"
                    style="margin-bottom: 15px;padding-top: 10px; border-top: 1px solid deepskyblue"
                  >Số lượng</h4>
                  <el-form-item
                    v-for="tree in farmStructureForm.numbers"
                    :key="tree.name"
                    label-width="220px"
                    :prop="tree.name"
                    :label="tree.name"
                    style="margin-bottom: 0; margin-left: 10px;"
                  >
                    <el-input-number v-model="tree.value" size="mini" :min="0"/>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </el-dialog>
    </div>
    <div v-else style="clear: both">
      <el-card>
        <span>
          Ban chua co vuon nao ca. hay bat dau dang ky vuon
        </span>
      </el-card>
    </div>
  </el-card>
</template>

<script>
import PieChart from './components/pie-chart'
import FarmDescription from './components/farm-description'
import DragKanban from './components/drag-kanban'
import {getAllFarms, searchTreesByName, updateFarm, updateFarmTrees} from '@/api/farm'
import MDInput from '@/components/MDinput'

export default {
  name: 'Index',
  components: {PieChart, FarmDescription, DragKanban, MDInput},
  data() {
    return {
      farms: [],
      currentFarm: {
        name: '',
        address: '',
        descriptions: {},
        trees: []
      },
      farmStatistic: {},
      activeFarm: '0',
      loadingFarm: false,
      pieChartKey: 0,
      farmStructureKey: 0,
      farmInfoForm: {},
      formsHaveData: false,
      farmInfoFormRules: {
        'name.content': [
          {required: true, message: 'Tên vườn không được trống !', trigger: 'blur'}
        ],
        'address.content': [
          {required: true, message: 'Địa chỉ không được trống !', trigger: 'blur'}
        ]
      },
      farmStructureForm: {},
      inputTreeVisible: false,
      inputTree: '',
      dialogVisible: false,
      buttonResetLoading: false,
      buttonSaveLoading: false,
      loadingInfoFarm: false,
      loadingStatistic: false
    }
  },
  computed: {
    hasFarm() {
      return this.farms.length > 0
    },
    farmInfoFormHasChanged() {
      // check the farm name
      if (this.currentFarm.name !== this.farmInfoForm.name.content) {
        console.log('name is not equal: ' + this.currentFarm.name + ', ' + this.farmInfoForm.name.content)
        return true
      }
      if (this.currentFarm.address !== this.farmInfoForm.address.content) {
        console.log('address is not equal: ' + this.currentFarm.address + ', ' + this.farmInfoForm.address.content)
        return true
      }
      // check throw farm's descriptions
      const descriptions = []
      for (const key of Object.keys(this.currentFarm.descriptions)) {
        descriptions.push({
          label: key,
          content: this.currentFarm.descriptions[key]
        })
      }
      // 1. check the length of two arrays
      if (descriptions.length !== this.farmInfoForm.descriptions.length) {
        console.log('length is not equal: ' + descriptions.length + ', ' + this.farmInfoForm.descriptions.length)
        return true
      }
      // 2. check every single description

      for (let i = 0; i < descriptions.length; i++) {
        if (descriptions[i].content !== this.farmInfoForm.descriptions[i].content) {
          console.log('description is not equal: ' + descriptions[i].content + ', ' + this.farmInfoForm.descriptions[i].content)
          return true
        }
      }
      return false
    },
    farmStructureHasChanged() {
      if (this.farmStatistic.types.length !== this.farmStructureForm.types.length) {
        return true
      }
      if (this.farmStatistic.numbers.length !== this.farmStructureForm.numbers.length) {
        return true
      }
      for (let i = 0; i < this.farmStatistic.types.length; i++) {
        if (this.farmStatistic.types[i] !== this.farmStructureForm.types[i]) {
          return true
        }
        if (this.farmStatistic.numbers[i].name !== this.farmStructureForm.numbers[i].name) {
          return true
        }
        if (this.farmStatistic.numbers[i].value !== this.farmStructureForm.numbers[i].value) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    activeFarm: {
      handler(newActiveName) {
        this.loadFarmInfo(newActiveName)
      },
      immediate: false
    }
  },
  created() {
    this.fetchFarms()
  },
  methods: {
    async fetchFarms() {
      this.farms = await getAllFarms()
      if (this.farms.length > 0) {
        if (this.farms.length <= this.activeFarm * 1) {
          this.activeFarm = '0'
        }
        this.loadFarmInfo(this.activeFarm * 1)
      }
      this.farmInfoForm = this.cloneFarmInfo()
      this.farmStructureForm = this.cloneFarmStructure()

      this.$nextTick(function () {
        this.formsHaveData = true
      }.bind(this))
    },
    loadFarmInfo(farmId) {
      this.currentFarm = this.farms[farmId]

      const newStatistic = this.currentFarm.trees.reduce((farmStatis, curTree) => {
        const treeName = curTree.treeName
        farmStatis.types.push(treeName)
        farmStatis.numbers.push({
          name: treeName,
          value: curTree.quantity,
          treeId: curTree.treeId
        })
        return farmStatis
      }, {
        types: [],
        numbers: []
      })

      let reRenderChart = false
      if (this.farmStatistic.numbers == null) {
        reRenderChart = true
      } else if (this.farmStatistic.numbers.length !== newStatistic.numbers.length) {
        reRenderChart = true
      } else {
        for (let i = 0; i < this.farmStatistic.numbers.length; i++) {
          const curTreeStat = this.farmStatistic.numbers[i]
          const newTreeStat = newStatistic.numbers[i]

          if (curTreeStat.value !== newTreeStat.value) {
            reRenderChart = true
            break
          }
        }
      }
      this.farmStatistic = newStatistic
      if (reRenderChart) {
        this.forceRenderPieChart()
      }
    },
    forceRenderPieChart() {
      this.pieChartKey += 1
    },
    handleEdit() {
      this.dialogVisible = false
      this.farmInfoForm = this.cloneFarmInfo()
      this.farmStructureForm = this.cloneFarmStructure()
      this.dialogVisible = true
    },
    alertDelete() {
      this.$confirm('Vườn sẽ bị xóa vĩnh viễn, bạn có chắc không ?', 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.handleDelete()
      }).catch(() => {
        console.log('cancel delete !')
      })
    },
    handleDelete() {
      console.log('xoa vuon', this.currentFarm.id)
    },
    cloneFarmInfo() {
      const name = {
        content: this.currentFarm.name,
        inputVisible: false
      }
      const address = {
        content: this.currentFarm.address,
        inputVisible: false
      }
      const descriptions = []
      for (const key in this.currentFarm.descriptions) {
        descriptions.push({
          label: key,
          content: this.currentFarm.descriptions[key],
          inputVisible: false,
          inputLabelVisible: false
        })
      }
      return {
        name: name,
        address: address,
        descriptions: descriptions
      }
    },
    cloneFarmStructure() {
      if (this.farmStatistic.types === undefined || this.farmStatistic.numbers === undefined) {
        return null
      }
      const types = [...this.farmStatistic.types]
      const numbers = this.farmStatistic.numbers.map(element => {
        return {...element}
      })
      return {
        types: types,
        numbers: numbers
      }
    },
    handleResetFarmInfoForm() {
      this.buttonResetLoading = true
      this.loadingInfoFarm = true
      setTimeout(function () {
        this.farmInfoForm = this.cloneFarmInfo()
        this.buttonResetLoading = false
        this.loadingInfoFarm = false
      }.bind(this), 500)
    },
    handleSaveFarmInfoForm() {
      this.$refs['farmInfoForm'].validate(valid => {
        if (valid) {
          this.buttonSaveLoading = true
          const name = this.farmInfoForm.name.content
          const address = this.farmInfoForm.address.content
          const descriptions = this.farmInfoForm.descriptions.reduce((desc, curDesc) => {
            desc[curDesc.label] = curDesc.content
            return desc
          }, {})
          const newFarmInfo = {
            id: this.currentFarm.id,
            name: name,
            address: address,
            descriptions: descriptions
          }
          console.log(newFarmInfo)
          updateFarm(newFarmInfo).then(result => {
            console.log('success, result: ', result)
            this.farms[this.activeFarm] = result
            this.loadFarmInfo(this.activeFarm)
            this.handleResetFarmInfoForm()
            this.$message.success('Cập nhật thông tin thành công')
          }).catch(err => {
            console.log(err)
            this.$message.error('Cập nhật thông tin thất bại')
          }).finally(() => {
            setTimeout(function () {
              this.buttonSaveLoading = false
            }.bind(this), 300)
          })
        } else {
          console.log('farm info form is not valid !')
          return false
        }
      })
    },
    async queryTreeSearch(queryString, cb) {
      console.log('query tree search, ', queryString)
      const result = await searchTreesByName(queryString)
      this.lastQuerySearchResult = result
      const nonExistTrees = result.filter(tree => {
        for (const currentTree of this.farmStructureForm.types) {
          if (currentTree === tree.name) {
            return false
          }
        }
        return true
      })
      cb(nonExistTrees.map(tree => {
        return {value: tree.name}
      }))
    },
    handleResetFarmStructureForm() {
      this.farmStructureForm = this.cloneFarmStructure()
    },
    handleSaveFarmStructureForm() {
      const trees = this.farmStructureForm.numbers.map(tree => {
        return {
          treeId: tree.treeId,
          quantity: tree.value
        }
      })
      const newFarmTrees = {
        farmId: this.currentFarm.id,
        trees: trees
      }
      console.log('save farm structure, ', newFarmTrees)
      updateFarmTrees(newFarmTrees).then(result => {
        console.log('result, ', result.trees)
        this.farms[this.activeFarm] = result
        this.loadFarmInfo(this.activeFarm)
        this.handleResetFarmStructureForm()
        this.$message.success('Cập nhật thông tin thành công')
      }).catch(err => {
        console.log(err)
        this.$message.error('Cập nhật thông tin thất bại')
      })
    },
    showInput(element, referenceName, isArray) {
      element.inputVisible = true
      element.inputLabelVisible = true
      this.$nextTick(function (isArray) {
        if (isArray) {
          this.$refs[referenceName][0].$refs.input.focus()
        } else {
          this.$refs[referenceName].$refs.input.focus()
        }
      }.bind(this, isArray))
    },
    handleInsertDescription() {
      console.log('insert more description')
      const index = this.farmInfoForm.descriptions.length
      this.farmInfoForm.descriptions.push({
        label: '',
        content: '',
        inputVisible: false,
        inputLabelVisible: false
      })
      this.showInput(this.farmInfoForm.descriptions[index], 'desc' + index, true)
    },
    handleRemoveTree(tree) {
      this.farmStructureForm.types.splice(this.farmStructureForm.types.indexOf(tree), 1)
      for (let i = 0; i < this.farmStructureForm.numbers.length; i++) {
        if (this.farmStructureForm.numbers[i].name === tree) {
          this.farmStructureForm.numbers.splice(i, 1)
          break
        }
      }
    },
    handleInputTreeConfirm() {
      console.log('handle input confirm')
      if (this.inputTree) {
        let treeId
        for (const treeData of this.lastQuerySearchResult) {
          if (treeData.name === this.inputTree) {
            treeId = treeData.id
          }
        }
        this.farmStructureForm.types.push(this.inputTree)
        this.farmStructureForm.numbers.push({
          name: this.inputTree,
          treeId: treeId,
          value: 0
        })
      }
      this.inputTree = ''
      this.inputTreeVisible = false
    },
    showInputTree() {
      this.inputTreeVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTreeTagInput.$refs.input.focus()
      })
    },
    checkRemoveDescription(desc, index) {
      if (desc.label.trim() === '') {
        if (desc.content.trim() === '') {
          this.farmInfoForm.descriptions.splice(index, 1)
        }
      } else {
        desc.inputLabelVisible = false
      }
    }
  }
}
</script>

<style scoped>
.detail-info {
  margin-top: 20px;
}

.chart-container {
  width: 450px;
  padding: 20px;
  float: right;
  border: 1px solid #97a8be;
  border-radius: 6px;
}

.activity-container {
  width: 700px;
  padding: 20px;
  border: 1px solid #97a8be;
  border-radius: 6px;
}

.title {
  font-weight: lighter;
  display: block;
  margin-bottom: 20px;
  color: #5a5e66;
  text-align: center;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.el-tag {
  margin-left: 10px;
}

.input-new-tag {
  width: 190px;
  margin-left: 10px;
  vertical-align: bottom;
}

.el-label-input {
  display: inline-block;
  width: 100px;
  margin-right: 20px;
  margin-left: -120px;
  vertical-align: bottom;
}

.scale-icon {
  font-size: 2em;
  position: relative;
  top: 0.2em;
}
</style>
