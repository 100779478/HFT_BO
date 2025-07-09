<template>
  <Modal
      v-model="localVisible"
      draggable
      sticky
      mask
      :width="chooseRule ? 1340 : 600"
      :mask-closable="false"
      :title="isNew ? '新增策略模板' : '编辑策略模板'"
      @on-cancel="handleCancel"
  >
    <div :class="[chooseRule ? 'modal__content' : '']">
      <div class="modal__content-left">
        <Form
            ref="ruleForm"
            :model="userStrategyInfo"
            :label-width="150"
            label-colon
            :rules="userValidRules"
            autocomplete="off"
        >
          <Col :span="20">
            <FormItem label="策略文件类型" prop="ruleFileType">
              <Select
                  v-model="userStrategyInfo.ruleFileType"
                  placeholder="请选择策略文件类型"
                  :maxlength="32"
                  @on-change="$emit('fetch-new-policy')"
                  :disabled="!isNew"
              >
                <Option
                    v-for="item in getRuleFileType()"
                    :key="item.code"
                    :value="item.code"
                >{{ item.description }}
                </Option>
              </Select>
            </FormItem>
          </Col>

          <Col :span="24">
            <FormItem label="策略类型" prop="ruleType">
              <Select
                  v-model="userStrategyInfo.ruleType"
                  placeholder="请选择策略类型"
                  :disabled="!isNew"
                  :maxlength="32"
                  @on-change="$emit('show-params-table')"
              >
                <Option
                    v-for="item in getRuleQuantType()"
                    :key="item.code"
                    :value="item.code"
                >{{ item.description }}
                </Option>
              </Select>
            </FormItem>
          </Col>

          <Col :span="24">
            <FormItem label="策略ID" prop="ruleId">
              <Input
                  v-model="userStrategyInfo.ruleId"
                  disabled
                  placeholder="请输入策略ID"
                  :maxlength="20"
                  show-message="false"
              ></Input>
            </FormItem>
          </Col>

          <Col :span="24">
            <FormItem label="策略文件路径" prop="ruleLocation">
              <Tooltip
                  :disabled="!userStrategyInfo.ruleLocation"
                  :content="userStrategyInfo.ruleLocation"
                  max-width="300"
                  style="width: 100%"
              >
                <Input
                    disabled
                    v-model="userStrategyInfo.ruleLocation"
                    placeholder="请输入策略文件路径"
                    @change="$emit('change-rule-path')"
                    autocomplete="off"
                    :maxlength="256"
                />
              </Tooltip>
            </FormItem>
          </Col>

          <Col :span="24">
            <FormItem label="策略文件名称" prop="ruleFileName">
              <Input
                  v-model="userStrategyInfo.ruleFileName"
                  :disabled="userStrategyInfo.ruleFileType === '1'"
                  placeholder="c++策略文件名称以.so结尾"
                  autocomplete="off"
                  :maxlength="32"
              ></Input>
            </FormItem>
          </Col>

          <Col :span="24">
            <FormItem label="策略版本" prop="ruleVersion">
              <Input
                  v-model="userStrategyInfo.ruleVersion"
                  placeholder="请输入策略版本"
                  autocomplete="off"
                  :maxlength="32"
              ></Input>
            </FormItem>
          </Col>

          <Col :span="24">
            <FormItem label="策略名称" prop="ruleName">
              <Input
                  v-model="userStrategyInfo.ruleName"
                  placeholder="请输入策略名称"
                  autocomplete="off"
                  :maxlength="32"
              ></Input>
            </FormItem>
          </Col>

          <Col :span="24">
            <FormItem label="用户代码" prop="customerIds">
              <Select
                  v-model="userStrategyInfo.customerIds"
                  placeholder="请选择用户代码"
                  :maxlength="32"
                  multiple
                  filterable
                  :max-tag-count="1"
              >
                <Option
                    v-for="item in userList"
                    :key="item.customerId"
                    :value="item.customerId"
                >{{ item.customerId + `(${item.customerName})` }}
                </Option>
              </Select>
            </FormItem>
          </Col>

          <Col :span="24">
            <FormItem label="策略服务节点名称" prop="ruleNodeName">
              <Select
                  v-model="userStrategyInfo.ruleNodeName"
                  placeholder="请选择策略服务节点"
                  :maxlength="32"
              >
                <Option
                    v-for="item in ruleMonitorNodes"
                    :key="item.ruleNodeName"
                    :value="item.ruleNodeName"
                >{{ item.ruleNodeName }}
                </Option>
              </Select>
            </FormItem>
          </Col>

          <Col :span="24">
            <FormItem label="">
              <input type="file" id="fileInput" style="display: none;" @change="$emit('file-change', $event)"/>
              <div class="progress-content" v-show="chooseRule">
                <Tooltip>
                  <div slot="content">
                    <p>C++策略文件格式必须为.so</p>
                    <p>Python策略文件格式必须为.zip</p>
                  </div>
                  <Button @click="$emit('upload-strategy')" class="btn" type="success">
                    <Icon type="md-cloud-upload"/>
                    上传策略文件
                  </Button>
                </Tooltip>
                <Circle
                    v-if="fileUploadProgress"
                    :percent="fileUploadProgress - 1"
                    :size="30"
                    :stroke-color="'#19be6b'"
                    :trail-width="10"
                    :stroke-width="13"
                >
                  <Icon
                      v-if="fileName"
                      type="ios-checkmark"
                      size="25"
                      style="font-weight: bold; color: #19be6b"
                  ></Icon>
                  <span v-else class="demo-Circle-inner" style="font-size: 11px">{{ fileUploadProgress - 1 }}%</span>
                </Circle>
              </div>
              <div style="height: 20px">{{ fileName }}</div>
            </FormItem>
          </Col>
        </Form>
      </div>

      <div class="modal__content-right" v-show="chooseRule">
        <Button @click="$emit('upload-param')" class="btn" type="info">导入参数</Button>
        <Button @click="$emit('add-param')" class="btn" type="success">添加参数</Button>
        <Button @click="$emit('clear-param')" class="btn" type="error">清空列表</Button>
        <Button @click="$emit('export-param')" class="btn" type="primary">导出参数</Button>
        <ParamsTable :paramList="paramList" :readOnly="false"/>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" @click="handleCancel">取消</Button>
      <Button type="primary" @click="$emit('confirm')" :loading="btnLoading">确定</Button>
    </div>
  </Modal>
</template>

<script>
import ParamsTable from '@/components/ParamsTable.vue';

export default {
  name: 'StrategyModal',
  components: {ParamsTable},
  props: {
    visible: Boolean,
    chooseRule: Boolean,
    isNew: Boolean,
    userStrategyInfo: Object,
    userValidRules: Object,
    paramList: Array,
    userList: Array,
    ruleMonitorNodes: Array,
    btnLoading: Boolean,
    fileName: String,
    fileUploadProgress: Number,
  },
  data() {
    return {
      localVisible: this.visible
    }
  },
  watch: {
    visible(val) {
      this.localVisible = val;
    }
  },
  methods: {
    resetFormFields() {
      this.$refs.ruleForm?.resetFields();
    },
    handleCancel() {
      this.localVisible = false;
      this.$emit('cancel'); // 通知父组件关闭
    },
    getRuleFileType() {
      return this.$parent.getRuleFileType?.() || [];
    },
    getRuleQuantType() {
      return this.$parent.getRuleQuantType?.() || [];
    },
  },
};
</script>

<style scoped lang="less">
.modal__content {
  display: flex;
  gap: 30px;
}

.modal__content-right .btn {
  color: white;
  font-weight: bold;
  margin-right: 5px;
  margin-bottom: 5px;
}

.progress-content {
  display: flex;
  align-content: center;
  align-items: center;
  gap: 10px;
}
</style>
