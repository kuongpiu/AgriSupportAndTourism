<template>
  <div class="components-container board">
    <el-dialog
      :title="activity.name"
      :visible.sync="dialogVisible">
      <el-form :model="activity" style="padding:0 10px 50px 10px">
        <el-form-item prop="inputTag" label="Người tham gia">
          <div><br></div>
          <el-tag
            v-for="(participant, index) in activity.participants"
            :key="participant + index"
            closable
            class="el-tag"
            :disable-transitions="true"
            @close="handleRemoveParticipant(participant)">
            {{participant}}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputTag"
            class="input-new-tag"
            size="mini"
            @keyup.enter.native.prevent="handleInputConfirm"
            @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" icon="el-icon-plus" @click="showInputTag">Thêm</el-button>
        </el-form-item>
        <el-form-item prop="description" label="Ghi chú">
          <el-input style="margin-left: 10px" v-model="activity.description" type="textarea" :autosize="{minRows: 3, maxRows: 6}"/>
        </el-form-item>
        <div style="float: right">
          <el-button type="primary" plain icon="el-icon-refresh-left">Reset</el-button>
          <el-button type="success" plain icon="el-icon-check">Save</el-button>
        </div>
      </el-form>
    </el-dialog>
    <Kanban
      key="todoActivities"
      :list="todoActivities"
      :group="group"
      class="kanban todo"
      header-text="Hoạt động"
      @showDetailActivity="handleShowDetailActivity"
      @change="handleTodoActivitiesChangeEvent"/>
    <Kanban
      key="finishedActivities"
      :list="finishedActivities"
      :group="group"
      class="kanban done"
      header-text="Hoàn thành"
      @showDetailActivity="handleShowDetailActivity"
      @change="handleFinishedActivitiesChange"/>
  </div>
</template>
<script>
import Kanban from './Kanban'

export default {
  name: 'DragKanbanDemo',
  components: {
    Kanban
  },
  data() {
    return {
      group: 'mission',
      todoActivities: [
        {name: 'Tuới nước', id: 1},
        {name: 'Làm cỏ', id: 2},
        {name: 'Bón phân', id: 3},
        {name: 'Thu hoạch', id: 4}
      ],
      finishedActivities: [
        {name: 'Phun thuốc', id: 5}
      ],
      dialogVisible: false,
      activity: {
        name: '',
        participants: [],
        description: ''
      },
      inputVisible: false,
      inputTag: ''
    }
  },
  methods: {
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
    handleShowDetailActivity(element) {
      this.activity.name = element.name
      this.dialogVisible = true
    },
    handleRemoveParticipant(participant){
      this.activity.participants.splice(this.activity.participants.indexOf(participant), 1)
    },
    handleInputConfirm(){
      const inputValue = this.inputTag
      if (inputValue) {
        this.activity.participants.push(inputValue)
      }
      this.inputTag = ''
      this.inputVisible = false
    },
    showInputTag(){
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
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
.button-new-tag{
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
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

