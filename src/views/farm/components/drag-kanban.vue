<template>
  <el-card>
    <div style="padding-bottom: 10px; display: flex; justify-content: space-between">
      <h3>
        <i class="icon-before el-icon-edit-outline"/>
        Quản lý hoạt động
      </h3>
      <div style="display: flex; align-items: center">
        <el-date-picker
          ref="datePicker"
          v-model="inputDate"
          type="date"
          format="dd/MM/yyyy"
          value-format="dd/MM/yyyy"
          :default-value="new Date()"
          placeholder="Hôm nay"
          :picker-options="datePickerOptions"
          @change="searchFarmCaresByDate"
        />
      </div>
    </div>
    <div class="components-container">
      <el-dialog
        :title="farmCare.activity.name"
        :visible.sync="dialogVisible"
        :fullscreen="false"
        :width="'80%'"
        :center="true"
        :top="'2vh'"
        :close-on-click-modal="false"
      >
        <div
          v-if="farmCare.activity.description.length > 0"
          style="padding: 0 10px; margin-top: -20px; padding-bottom: 8px; border-bottom: 1px solid #bfcbd9"
        >
          <i
            class="el-icon-info"
            style="color: #4dd9d5"
          />
          <span
            style="line-height: 1.3rem;"
          > {{ farmCare.activity.description }} </span></div>
        <el-form v-loading="dialogLoading" :model="farmCare" style="padding:0 10px 50px 10px; margin-top: 20px">
          <el-form-item prop="inputTag" label="Người tham gia">
            <div><br></div>
            <el-tag
              v-for="(visitor, index) in farmCare.visitors"
              :key="visitor + index"
              closable
              class="el-tag"
              :disable-transitions="true"
              @close="handleRemoveVisitor(visitor)"
            >
              {{ visitor }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputTag"
              class="input-new-tag"
              size="mini"
              @keyup.enter.native.prevent="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag" size="small" icon="el-icon-plus" @click="showInputTag">Thêm
            </el-button>
          </el-form-item>
          <h4 style="margin-bottom: 15px">Loại cây</h4>
          <el-form-item prop="trees">
            <el-row
              v-for="tree in farmCare.trees"
              :key="'container' + tree.treeId"
              style="margin-bottom: 20px"
            >
              <el-col :span="6">
                <el-tag
                  closable
                  class="el-tag"
                  :disable-transitions="true"
                  @close="handleRemoveTree(tree)"
                >
                  {{ tree.treeName }}
                </el-tag>
              </el-col>
              <el-col :span="18">
                <div
                  class="div-contain-input"
                >
                  <el-input
                    v-model="tree.status"
                    clearable
                    :autosize="{maxRows: 3, minRows: 1}"
                    type="textarea"
                    placeholder="Mô tả"
                  />
                </div>
              </el-col>
            </el-row>
            <el-autocomplete
              v-if="inputTreeVisible"
              ref="saveActivityTreeTagInput"
              v-model="inputTree"
              class="input-new-tag-large"
              value-key="treeName"
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
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="careDate" label="Ngày tham gia (Ngày/Tháng/Năm)">
                <br/>
                <el-date-picker
                  ref="datePicker"
                  v-model="farmCare.careDate"
                  style="margin-left: 10px"
                  type="date"
                  format="dd/MM/yyyy"
                  value-format="dd/MM/yyyy"
                  placeholder="ngày"
                  :picker-options="datePickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="careTime" label="Giờ tham gia (Giờ:Phút:Giây)">
                <br/>
                <el-time-picker
                  v-model="farmCare.careTime"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  style="margin-left: 10px"
                  placeholder="giờ">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="description" label="Ghi chú">
            <el-input
              v-model="farmCare.description"
              style="margin-left: 10px"
              type="textarea"
              :autosize="{minRows: 3, maxRows: 6}"
            />
          </el-form-item>
          <div style="float: right">
            <div v-if="isUpdateOperation">
              <el-button
                :loading="buttonDeleteActivityLoading"
                type="danger"
                plain
                @click="handleDeleteFarmCare"
              >
                Xóa
              </el-button>
              <el-button
                type="success"
                plain
                :loading="buttonSaveActivityLoading"
                @click="handleUpdateActivity"
              >Cập nhật
              </el-button>
            </div>
            <div v-else>
              <el-button
                type="success"
                plain
                :loading="buttonSaveActivityLoading"
                @click="handleSaveActivity"
              >Tạo
              </el-button>
            </div>
          </div>
        </el-form>
      </el-dialog>
      <div class="board">
        <div>
          <Kanban
            key="todoActivities"
            :list="todoActivities"
            group="group"
            class="kanban todo"
            header-text="Hoạt động"
            @showDetailActivity="handleShowCreateFarmCareDialog"
            @change="handleTodoActivitiesChangeEvent"
          />
          <el-button
            style="margin-top: 20px"
            plain
            type="primary"
            icon="el-icon-plus"
          >
            Thêm hoạt động
          </el-button>
        </div>
        <Kanban
          key="finishedActivities"
          :list="finishedActivities"
          :group="group"
          class="kanban done"
          header-text="Hoàn thành"
          @showDetailActivity="handleShowDetailActivity"
          @change="handleFinishedActivitiesChange"
        />
      </div>
    </div>
  </el-card>
</template>
<script>
import Kanban from './Kanban'
import {getAllActivities} from '@/api/activity'
import {
  deleteFarmCare,
  getFarmCareById,
  insertFarmCare,
  searchFarmCaresByDate,
  updateFarmCare
} from '@/api/farm-care'

export default {
  name: 'DragKanbanDemo',
  components: {
    Kanban
  },
  props: {
    farm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      group: 'mission',
      todoActivities: [],
      finishedActivities: [],
      dialogVisible: false,
      activity: {
        name: '',
        participants: [],
        description: ''
      },
      farmCare: {
        activity: {
          id: '',
          name: '',
          description: ''
        },
        trees: [],
        visitors: [],
        careDate: '',
        careTime: '',
        description: ''
      },
      treeList: [],
      inputVisible: false,
      inputTag: '',
      inputTreeVisible: false,
      inputTree: '',
      buttonDeleteActivityLoading: false,
      buttonSaveActivityLoading: false,
      isUpdateOperation: false,
      inputDate: '',
      dialogLoading: false,
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: 'Hôm nay',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: 'Hôm qua',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: 'Tuần trước',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  mounted() {
    this.fetchActivity()
  },
  created() {
    this.searchFarmCaresByDate()
    console.log('created, farm id: ', this.farm.id)
  },
  methods: {
    fetchActivity() {
      getAllActivities()
        .then(data => {
          this.todoActivities = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleTodoActivitiesChangeEvent(event) {
      if (event.added) {
        console.log('todo activities: added')
      } else if (event.removed) {
        console.log('todo activities: removed')
      } else {
        console.log('todo activities: moved')
      }
      console.log(event)
    },
    handleFinishedActivitiesChange(event) {
      if (event.added) {
        console.log('finished activities: added')
      } else if (event.removed) {
        console.log('finished activities: removed')
      } else {
        console.log('finished activities: moved')
      }
      console.log(event)
    },
    handleShowCreateFarmCareDialog(element) {
      this.farmCare = {
        activity: element,
        trees: [],
        visitors: [],
        description: ''
      }
      this.treeList = this.farm.trees
      this.dialogVisible = true
      this.isUpdateOperation = false
      this.inputTreeVisible = false
    },
    bindDataToFarmCareHistory(activity, data) {
      const trees = data.farmCareHistoryDTO.treeCares.map(treeCare => {
        return {
          treeId: treeCare.tree.id,
          treeName: treeCare.tree.name,
          id: treeCare.id,
          status: treeCare.status
        }
      })
      const visitors = data.visitors.map(visitor => {
        return visitor.username
      })
      this.farmCare = {
        activity: activity,
        trees: trees,
        careTime: data.farmCareHistoryDTO.careTime,
        careDate: data.farmCareHistoryDTO.careDate,
        visitors: visitors,
        description: data.farmCareHistoryDTO.description
      }
    },
    handleShowDetailActivity(element) {
      const farmCareId = element.farmCareId
      this.dialogVisible = true
      this.isUpdateOperation = true
      this.treeList = this.farm.trees
      this.inputTreeVisible = false
      this.dialogLoading = true
      getFarmCareById(farmCareId)
        .then(data => {
          console.log(data)
          this.bindDataToFarmCareHistory(element, data)
        })
        .catch(err => {
          this.dialogVisible = false
          this.isUpdateOperation = false
          this.$message.error('Lỗi không tải được dữ liệu')
          console.log(err)
        })
        .finally(() => {
          this.dialogLoading = false
        })
    },
    handleRemoveVisitor(visitor) {
      this.farmCare.visitors.splice(this.farmCare.visitors.indexOf(visitor), 1)
    },
    handleInputConfirm() {
      const inputValue = this.inputTag
      if (inputValue) {
        this.farmCare.visitors.push(inputValue)
      }
      this.inputTag = ''
      this.inputVisible = false
    },
    showInputTag() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleDeleteFarmCare() {
      this.$confirm('Hoạt động này sẽ bị xóa vĩnh viễn, bạn có chắc không ?', 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        console.log('handle delete farm care, ', this.farmCare.activity.farmCareId)
        deleteFarmCare(this.farmCare.activity.farmCareId)
          .then(() => {
            this.$message.success('Xóa thành công')
            this.dialogVisible = false
            this.searchFarmCaresByDate()
            this.emitReRenderActivity()
          })
          .catch(err => {
            this.$message.error('Lỗi khi xóa')
            console.log(err)
          })
      }).catch(() => {
        console.log('cancel delete !')
      })
    },
    handleUpdateActivity() {
      const treeCares = this.farmCare.trees.map(tree => {
        return {
          id: tree.id,
          tree: {
            id: tree.treeId
          },
          status: tree.status
        }
      })
      const visitors = this.farmCare.visitors.map(username => {
        return {
          username: username
        }
      })
      const farmCareDataSubmit = {
        farmCareHistoryDTO: {
          id: this.farmCare.activity.farmCareId,
          farmId: this.farm.id,
          activity: {
            id: this.farmCare.activity.id
          },
          careDate: this.farmCare.careDate,
          careTime: this.farmCare.careTime,
          treeCares: treeCares,
          description: this.farmCare.description
        },
        visitors: visitors
      }
      console.log('send update farm care query, ', farmCareDataSubmit)
      this.buttonSaveActivityLoading = true
      // TODO 1: Việc cần làm là validate các form trước khi gửi
      // TODO 2: Chức năng thêm hoạt động ngoài các hoạt động có sẵn
      updateFarmCare(farmCareDataSubmit)
        .then(data => {
          this.$message.success('Cập nhật thành công')
          console.log('update successfully, ', data)
          this.dialogVisible = false
          this.emitReRenderActivity()
        })
        .catch(err => {
          this.$message.error('Lỗi khi cập nhật')
          console.log(err)
        })
        .finally(() => {
          this.buttonSaveActivityLoading = false
        })
    },
    handleSaveActivity() {
      const finishedActivity = this.farmCare.activity
      console.log(this.farmCare.trees)
      const treeCares = this.farmCare.trees.map(tree => {
        return {
          tree: {
            id: tree.treeId
          },
          status: tree.status
        }
      })
      const visitors = this.farmCare.visitors.map(username => {
        return {
          username: username
        }
      })
      const farmCareDataSubmit = {
        farmCareHistoryDTO: {
          farmId: this.farm.id,
          activity: {
            id: this.farmCare.activity.id
          },
          careDate: this.farmCare.careDate,
          careTime: this.farmCare.careTime,
          treeCares: treeCares,
          description: this.farmCare.description
        },
        visitors: visitors
      }
      console.log('save, ', farmCareDataSubmit)
      this.buttonSaveActivityLoading = true
      insertFarmCare(farmCareDataSubmit)
        .then(data => {
          this.$message.success('Tạo hoạt động thành công')
          console.log('successfully, ', data)
          this.farmCare.trees = []
          this.farmCare.visitors = []
          this.farmCare.description = ''
          this.finishedActivities.splice(0, 0, {
            farmCareId: data.farmCareHistoryDTO.id,
            ...finishedActivity
          })
          this.dialogVisible = false
          this.emitReRenderActivity()
        })
        .catch(err => {
          this.$message.error('Lỗi khi tạo')
          console.log(err)
        })
        .finally(() => {
          this.buttonSaveActivityLoading = false
        })
    },
    handleRemoveTree(tree) {
      this.farmCare.trees.splice(this.farmCare.trees.indexOf(tree), 1)
    },
    async queryTreeSearch(queryString, cb) {
      console.log('tree list', this.treeList)
      const existsTrees = this.farmCare.trees.map(tree => tree.treeId)
      const noneExistsTrees = this.treeList.filter(curTree => {
        return existsTrees.indexOf(curTree.treeId) < 0
      })
      const results = queryString ? noneExistsTrees.filter(this.createFilter(queryString)) : noneExistsTrees
      cb(results)
    },
    createFilter(queryString) {
      return (tree) => {
        return tree.treeName.toLowerCase().indexOf(queryString.toLowerCase()) > 0
      }
    },
    handleInputTreeConfirm(tree) {
      console.log('handle input tree confirm, ', tree)
      this.farmCare.trees.push({status: '', ...tree})
      this.inputTree = ''
      this.inputTreeVisible = false
    },
    showInputTree() {
      this.inputTreeVisible = true
      this.$nextTick(_ => {
        this.$refs['saveActivityTreeTagInput'].$refs.input.focus()
      })
    },
    searchFarmCaresByDate() {
      if (this.inputDate == null) {
        this.inputDate = ''
      }
      searchFarmCaresByDate(this.farm.id, this.inputDate)
        .then(data => {
          this.farmCareList = data
          this.finishedActivities = data.map(farmCare => {
            return {
              farmCareId: farmCare.farmCareHistoryDTO.id,
              ...farmCare.farmCareHistoryDTO.activity
            }
          })
        })
        .catch(err => {
          this.$message.error('Error !')
          console.log(err)
        })
    },
    emitReRenderActivity() {
      this.$emit('ReRenderActivity')
    }
  }
}
</script>
<style lang="scss">
.board {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}

.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }

  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }

  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag-large {
  width: 190px;
  margin-left: 10px;
  vertical-align: bottom;
}

.el-tag {
  margin-left: 10px;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.icon-before {
  padding-right: 10px;
}

.div-contain-input {
  width: 400px;
  margin-left: 20px;
  display: inline-block;
}
</style>

