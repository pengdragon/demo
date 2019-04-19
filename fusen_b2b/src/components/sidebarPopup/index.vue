<template>
  <div>
    <transition name="pop">
      <div v-show="showPopup" class="popup-content" :class="{show:showPopup}">
        <div v-if="!loadingState">
          <div class="chanceContent">
            <div class="company">
              {{propData.name}}
            </div>
            <div class="chanceDetail">
              <div>
                <div>商机编号</div>
                <div class="content">{{propData.number}}</div>
              </div>
              <div>
                <div>业务模式</div>
                <div class="content">{{propData.businessModelLabel}}</div>
              </div>
              <div>
                <div>跟进人</div>
                <div class="content">{{propData.createByName}}</div>
              </div>
              <div>
                <div>商检创建时间</div>
                <div class="content">{{propData.createDate}}</div>
              </div>
            </div>
          </div>
          <div>
            <el-tabs class="tabs">
              <el-tab-pane label="活动信息" class="actionContent">
                <el-form :model="newActionForm"
                         ref="contentForm"
                         :rules="newActionContentRules"
                         class="richText">
                  <div class="title">新增活动记录</div>
                  <div class="textInput-content">
                    <el-form-item prop="content">
                      <el-input type="textarea"
                                :autosize="{minRows: 4,maxRows: 4}"
                                v-model="newActionForm.content"
                                placeholder="请输入活动记录"></el-input>
                    </el-form-item>
                    <div class="iconContent">
                      <svg-icon class-name="iconItem" icon-class="smilingFace"></svg-icon>
                      <svg-icon class-name="iconItem" icon-class="img"></svg-icon>
                      <svg-icon class-name="iconItem" icon-class="address"></svg-icon>
                    </div>
                  </div>
                  <div class="addTag-content">
                    <el-tag
                      :key="tag"
                      v-for="tag in otherFollowerArr"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(tag)">
                      {{tag}}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+添加其他跟进人</el-button>
                  </div>
                  <el-form inline
                           ref="actionForm"
                           :model="newActionForm"
                           :rules="newActionContentRules"
                           size="small" class="formContent">
                    <div class="formFlex">
                      <el-form-item label="跟进时间:" class="longMargin" prop="recordDate">
                        <el-date-picker
                          class="smallInput"
                          v-model="newActionForm.recordDate"
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item label="跟进对象:" class="longMargin" prop="visitObject">
                        <el-input class="smallInput" placeholder="请输入对象名" v-model="newActionForm.visitObject"></el-input>
                      </el-form-item>
                    </div>
                    <div class="formFlex">
                      <el-form-item class="miniMargin" prop="visitAddress" label="跟进地址">
                        <el-input class="longInput" placeholder="请输入地址" v-model="newActionForm.visitAddress"></el-input>
                      </el-form-item>
                      <span style="height: auto;">
                      <el-button type="primary"
                                 size="small"
                                 :loading="actionBtnLoading"
                                 @click="saveNewAction">发送</el-button>
                    </span>
                    </div>
                  </el-form>
                </el-form>
                <div class="actionList-content">
                  <el-card v-for="item in actionListData" :key="actionListData.id" shadow="hover" class="cardItem">
                    <div slot="header" class="flexBox">
                      <div class="item">
                        <img src="../../assets/img/avatar.jpg" alt="" class="avatar">
                        <span class="detail">
                        <div class="name">{{item.createByName}}</div>
                        <div class="time">{{cmtParseTime(item.recordDate,4)}}</div>
                      </span>
                      </div>
                      <div class="item">
                        <div class="followUp">
                          <span v-show="item.otherFollower">陪同跟进人: </span><span class="name">{{item.otherFollower}}</span>
                        </div>
                        <div class="followUp">
                        <span style="width: 78px;text-align: justify;">
                          <span>跟</span>
                          <span>进</span>
                          <span>对</span>
                          <span>象: </span>
                        </span><span class="name">{{item.visitObject}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text">
                      {{item.content}}
                    </div>
                    <div class="address-content">
                      <svg-icon icon-class="address" class="address"></svg-icon>
                      <span class="addressDetail">{{item.visitAddress}}</span>
                    </div>
                  </el-card>
                  <div v-if="!(actionListData.length)" class="noneActionMsg">
                    暂无活动信息
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="联系人" class="linkman-content">
                <div class="button-content">
                  <el-button type="primary" size="small" @click="dialogHandle('基本信息')">新增</el-button>
                  <el-button type="primary"
                             :disabled="settingMainBtnState"
                             @click="editorMessage('基本信息')"
                             size="small">修改</el-button>
                  <el-button type="primary"
                             :disabled="settingMainBtnState"
                             :loading="linkmanBtnLoading"
                             @click="settingMainContacts"
                             size="small">设为主联系人</el-button>
                </div>
                <div>
                  <tabTmp :tabData="linkmanTabData" :tabTagData="linkmanTabTagData"
                          :border="false"
                          :showIndex="false"
                          :showSelection="true"
                          @getSelectResult="linkmanSelect"
                          :tabHeight="'600'"></tabTmp>
                </div>
              </el-tab-pane>
              <el-tab-pane label="客户报价" class="clientPrice-content">
                <div class="button-content">
                  <el-button type="primary" size="small"
                             v-if="permItems.some(v=>v==='crm:businessOpportunity:addQuotation')"
                             @click="$router.push({path:'/clientGroup/opportunityManagement/newQuotation',query:{id:propData.id,createById:propData.createById,businessModel:propData.businessModel}})">新增</el-button>
                  <el-button type="primary" size="small"
                             v-if="permItems.some(v=>v==='crm:businessOpportunity:addQuotation')"
                             :disabled="auditBtnState"
                             :loading="auditBtnLoading"
                             @click="submitAudit">申请审批</el-button>
                </div>
                <div class="list-content">
                  <div v-for="item in customerQuotationList" :key="item.id"
                       class="listItem" :class="{active:item.select}" @click="selectItem(item)" @dblclick="lookDetail(item)">
                    <div class="type">
                      <div class="type-content">
                        <div class="businessType">{{item.businessModelLabel}}</div>
                        <div class="state"> {{item.approvalStatusLabel}} </div>
                      </div>
                      <div class="title">
                        {{item.number}}
                      </div>
                    </div>
                    <div class="fixedBox">
                      <div class="numberDetail">
                        <div class="number">{{item.agencyRate}}</div>
                        <div class="unit">%</div>
                      </div>
                      <div class="title">
                        代理费率
                      </div>
                    </div>
                    <div class="fixedBox">
                      <div class="numberDetail">
                        <div class="number">{{item.capitalOccupancyRate}}</div>
                        <div class="unit">%</div>
                      </div>
                      <div class="title">资金占用率</div>
                    </div>
                    <div class="fixedBox">
                      <div class="numberDetail">
                        <div class="number">{{item.quotaDemand}}</div>
                        <div class="unit">万</div>
                      </div>
                      <div class="title">
                        额度
                      </div>
                    </div>
                    <div class="payDetail">
                      <div class="payType-content">
                        <span class="title">结算方式:&nbsp;&nbsp;</span>
                        {{item.settlementMode}}
                      </div>
                      <div class="more">查看更多</div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div v-else class="loadingIcon" v-loading="true">
        </div>
      </div>
    </transition>
    <transition name="mask">
      <div v-show="showPopup" class="mask" :class="{show:showPopup}" @click="close"></div>
    </transition>
    <el-dialog :title="dialogTitle"
               top="25vh"
               width="600px"
               class="dialog-content"
               :visible.sync="showDialog">
      <el-form size="small" inline
               :model="linkmanForm"
               ref="linkmanVlidate"
               :rules="rules">
        <div class="dialogFlexBox">
          <el-form-item label="姓名" prop="contacts" class="item">
            <el-input class="input" v-model="linkmanForm.contacts"></el-input>
          </el-form-item>
          <el-form-item label="性别" class="item">
            <el-radio v-model="linkmanForm.sex" label="男" :value="'男'">男</el-radio>
            <el-radio v-model="linkmanForm.sex" label="女" :value="'女'">女</el-radio>
          </el-form-item>
          <el-form-item label="职务" class="item">
            <el-input v-model="linkmanForm.job" class="input"></el-input>
          </el-form-item>
          <el-form-item label="生日" class="item">
            <!--<el-input v-model="linkmanForm.birthday" class="input"></el-input>-->
            <el-date-picker
              v-model="linkmanForm.birthday"
              type="date"
              placeholder="选择生日">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="爱好" class="item">
            <el-input v-model="linkmanForm.hobby" class="input"></el-input>
          </el-form-item>
          <el-form-item label="通讯地址" class="item">
            <el-input v-model="linkmanForm.postalAddress" class="input"></el-input>
          </el-form-item>
          <p class="dialog__title2">
            联系方式
          </p>
          <el-form-item label="电话" prop="telephone" class="item">
            <el-input v-model="linkmanForm.telephone" class="input"></el-input>
          </el-form-item>
          <el-form-item label="qq" class="item">
            <el-input v-model="linkmanForm.qq" class="input"></el-input>
          </el-form-item>
          <el-form-item label="微信" class="item">
            <el-input v-model="linkmanForm.weChat" class="input"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" class="item">
            <el-input v-model="linkmanForm.email" class="input"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="btnContent">
        <el-button type="primary" size="small" @click="saveLinkman">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="扫码分享或点击下载"
               :visible.sync="shareDialogState"
               center
               top="30vh"
               width="40%"
               :before-close="closeHandle">
      <div class="share-content">
        <div class="shareItem">
          <QRCode :value="importProtocolURL" :options="{size:200}"></QRCode>
          <div class="downStyle" @click="downloadPdf(importProtocolURL)">进口协议.pdf</div>
        </div>
        <div class="shareItem">
          <QRCode :value="businessTableURL" :options="{size:200}"></QRCode>
          <div class="downStyle" @click="downloadPdf(businessTableURL)">业务审批表.pdf</div>
        </div>
      </div>
    </el-dialog>
    <form ref="formDownload"
          target="_blank"
          method="get"
          action=""></form>
  </div>
</template>

<script>
    import tabTmp from '@/components/tabTemplate'
    import { parseTime } from '@/utils/index'
    import req from '@/utils/req'
    import Vue from 'vue'
    import _ from 'lodash'
    import QRCode from '@xkeshi/vue-qrcode'
    export default {
      data() {
        return {
          sex: '男',
          otherFollowerArr: [],
          inputVisible: false,
          inputValue: '',
          actionListData: [],
          linkmanTabData: [],
          linkmanTabTagData: [
            {
              label: '姓名',
              prop: 'contacts',
              width: '120px'
            },
            {
              label: '职务',
              prop: 'job',
              width: '120px'
            },
            {
              label: '电话',
              prop: 'telephone',
              width: '140px'
            },
            {
              label: '邮件',
              prop: 'email',
              width: '187px'
            },
            {
              label: '主联系人',
              prop: 'isMainLabel',
              width: '100px'
            }
          ],
          dialogTitle: '',
          showDialog: false,
          linkmanForm: {
            contacts: '',
            sex: '',
            job: '',
            birthday: '',
            hobby: '',
            postalAddress: '',
            telephone: '',
            weChat: '',
            email: '',
            qq: ''
          },
          titleForm: {
            name: '',
            businessModelLabel: '',
            number: '',
            createByName: '',
            createDate: ''
          },
          newActionForm: {
            recordDate: '',
            visitObject: '',
            visitAddress: '',
            content: ''
          },
          linkmanSelectArr: [],
          rules: {
            telephone: [
              { required: true, message: '请输入电话号码', trigger: 'blur' }
            ],
            contacts: [
              { required: true, message: '请输入联系人姓名', trigger: 'blur' }
            ]
          },
          newActionContentRules: {
            content: [
              { required: true, message: '活动内容不能为空', trigger: 'blur' }
            ],
            recordDate: [
              { required: true, message: '跟进时间不能为空', trigger: 'blur' }
            ],
            visitObject: [
              { required: true, message: '跟进对象不能为空', trigger: 'blur' }
            ],
            visitAddress: [
              { required: true, message: '跟进地址不能为空', trigger: 'blur' }
            ]
          },
          newActionRules: {},
          BusinessMtData: {},
          customerQuotationList: [
            {
              id: '123',
              number: '', // 报价编号
              approvalStatusLabel: '保存', // 报价状态
              businessModelLabel: '', // 业务模式
              agencyRate: '', // 代理费率
              capitalOccupancyRate: '', // 资金占用率
              quotaDemand: '', // 额度
              settlementMode: '' // 结算方式
            }
          ],
          selectPriceArr: [],
          loadingState: true,
          importProtocolURL: '', // 进口协议URL地址
          businessTableURL: '', // 业务审批表URL地址
          shareDialogState: false, // 分享dialog状态
          actionBtnLoading: false, // 活动发送按钮等待状态
          linkmanBtnLoading: false, // 设为主联系人等待状态
          auditBtnLoading: false // 通过审批按钮等待状态
        }
      },
      props: {
        showPopup: {
          type: Boolean,
          default: false
        },
        propData: {
          type: Object,
          default() {
            return {}
          }
        }
      },
      watch: {
        propData(v) {
          if (v.id) {
            this.loadingState = false
          }
          if (v.businessContactsList && v.businessContactsList.length) {
            this.linkmanTabData = v.businessContactsList
          }
          this.actionListData = v.businessPropulsionRecordList || []
          this.customerQuotationList = v.customerQuotationList || []
        },
        BusinessMtData(v) {
          if (v.businessContactsList && v.businessContactsList.length) {
            this.linkmanTabData = v.businessContactsList
          }
          this.actionListData = v.businessPropulsionRecordList || []
          this.customerQuotationList = v.customerQuotationList || []
        },
        showPopup(v) {
          if (!v) {
            this.selectPriceArr = []
            this.linkmanTabData = []
            this.actionListData = []
            this.customerQuotationList = []
          }
        },
        $route(v) {
          if (v.name !== 'opportunityManagement') {
            // 隐藏侧边栏
            this.close()
            // 数据恢复
            this.loadingState = true
          }
        }
      },
      methods: {
        editorMessage(title) {
          this.showDialog = true
          this.dialogTitle = title
          this.linkmanForm = this.linkmanSelectArr[0]
        },
        handleClose(tag) {
          this.otherFollowerArr.splice(this.otherFollowerArr.indexOf(tag), 1)
        },
        showInput() {
          this.inputVisible = true
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus()
          })
        },
        handleInputConfirm() {
          let inputValue = this.inputValue
          if (inputValue) {
            this.otherFollowerArr.push(inputValue)
          }
          this.inputVisible = false
          this.inputValue = ''
        },
        close() {
          this.$emit('hidePop')
          this.loadingState = true
        },
        dialogHandle(title) {
          this.linkmanForm = {}
          this.dialogTitle = title
          this.showDialog = true
        },
        saveLinkman() {
          this.$refs.linkmanVlidate.validate((valid) => {
            if (valid) {
              let form = this.linkmanForm
              let jsonStr = JSON.stringify(form)
              let businessId = this.propData.id
              req.post('business/saveContacts', {
                businessId,
                jsonStr
              }).then((res) => {
                this.showDialog = false
                this.$notify({
                  title: '成功',
                  message: res.msg,
                  type: 'success'
                })
                //  保存完刷新联系人数据
                this.getChanceData()
              })
            } else {
              return false
            }
          })
        },
        linkmanSelect(arr) {
          this.linkmanSelectArr = arr
        },
        getChanceData() {
          let id = this.propData.id
          req.get('business/viewBusinessById', {
            params: {
              id
            }
          }).then((res) => {
            this.BusinessMtData = res.data
          }).catch((err) => {
            console.log(err)
            this.$message({
              type: 'warning',
              message: '网络故障请重试!'
            })
          })
        },
        settingMainContacts() {
          this.linkmanBtnLoading = true
          let id = this.linkmanSelectArr[0].id
          req.post('business/setIsMainContact', {
            id,
            isMain: 1
          }).then((res) => {
            this.$notify({
              title: '成功',
              message: res.msg,
              type: 'success'
            })
            this.linkmanBtnLoading = false
            this.getChanceData()
          })
        },
        saveNewAction() {
          this.actionBtnLoading = true
          this.$refs.contentForm.validate((valida) => {
            if (valida) {
              this.$refs.actionForm.validate((valida) => {
                if (valida) {
                  this.newActionForm.otherFollower = this.otherFollowerArr.join('/') || ''
                  let businessId = this.propData.id
                  this.newActionForm.recordDate = parseTime(this.newActionForm.recordDate, 4)
                  let jsonStr = JSON.stringify(this.newActionForm)
                  req.post('business/savePropulsionRecord', {
                    businessId,
                    jsonStr
                  }).then((res) => {
                    this.$notify({
                      title: '成功',
                      message: res.msg,
                      type: 'success'
                    })
                    this.actionBtnLoading = false
                    // 清空输入列表
                    this.$refs.contentForm.resetFields()
                    this.$refs.actionForm.resetFields()
                    this.otherFollowerArr = []
                    this.getChanceData()
                  })
                } else {
                  this.actionBtnLoading = false
                }
              })
            } else {
              this.actionBtnLoading = false
            }
          })
        },
        cmtParseTime(date, type) {
          return parseTime(date, type)
        },
        selectItem(rows) {
          if (rows.approvalStatusLabel === '保存') {
            let status = !rows.select
            Vue.set(rows, 'select', status)
            if (status) {
              this.selectPriceArr.push(rows)
            } else {
              this.selectPriceArr = _.differenceWith(this.selectPriceArr, [rows], _.isEqual)
            }
          }
        },
        submitAudit() {
          this.auditBtnLoading = true
          let data = this.selectPriceArr
          let arr = []
          data.map((v) => {
            arr.push(v.id)
          })
          let ids = arr.join(',')
          req.post('business/submit', {
            ids
          }).then((res) => {
            this.$notify({
              title: '成功',
              message: res.msg,
              type: 'success'
            })
            this.auditBtnLoading = false
            this.importProtocolURL = 'https://b2b.fusen.net.cn/scp' + encodeURI(res.data.protocolFileUrl)
            this.businessTableURL = 'https://b2b.fusen.net.cn/scp' + encodeURI(res.data.bizAuditFileUrl)
            // 显示二维码
            this.shareDialogState = true
            this.getChanceData()
          })
        },
        lookDetail(item) {
          let validate = !this.permItems.some(v => v === 'crm:businessOpportunity:editQuotation')
          if (validate) { return }
          let state = 'true'
          if (item.approvalStatusLabel === '审核') {
            state = 'false'
          }
          this.$router.push({
            path: '/clientGroup/opportunityManagement/editQuotation',
            query: {
              id: this.propData.id,
              showId: item.id,
              showBtnState: state
            }
          })
        },
        closeHandle() {
          // 如果是新增保存则隐藏且返回商机列表
          this.shareDialogState = false
        },
        downloadPdf(url) {
          let formEl = this.$refs.formDownload
          formEl.action = encodeURI(url)
          formEl.submit()
        }
      },
      components: {
        tabTmp,
        QRCode
      },
      computed: {
        settingMainBtnState() {
          return !(this.linkmanSelectArr.length === 1)
        },
        auditBtnState() {
          return !(this.selectPriceArr.length)
        },
        permItems() {
          return this.$store.getters.permItems
        }
      }
    }
</script>

<style scoped lang="scss">
.popup-content{
  z-index: 10;
  position: absolute;
  right: 0;
  top: 0;
  width: 725px;
  height: 100%;
  border-left: 1px solid #d8dce5;
  box-shadow: -2px 0 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  background: #fff;
  .chanceContent{
    padding: 22px 22px 10px;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    background: #ECECEC;
    .company{
      font-size: 18px;
      font-weight: 600;
    }
    .chanceDetail{
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 14px;
      color: #999999;
      .content{
        margin-top: 5px;
        color: #333;
      }
    }
  }
  .tabs{
    height: 694px;
    .actionContent{
      padding: 10px 7px 0;
      .richText{
        border: 1px solid #d8dce5;
        padding: 10px 15px 0;
        .title{
          padding-left: 15px;
          font-size: 16px;
        }
        .textInput-content{
          margin-top: 10px;
          .iconContent{
            padding: 5px 0 5px 10px;
            border: 1px solid #d8dce5;
            background: #ECECEC;
            .iconItem{
              width: 30px;
              margin-right: 5px;
              color: #909090;
              cursor: pointer;
            }
          }
        }
        .addTag-content{
          padding: 5px;
          margin-top: 5px;
          border: 1px solid #d8dce5;
        }
        .formContent{
          margin-top: 5px;
          .formFlex{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            .smallInput{
              width: 250px;
            }
            .labelText{
              display: flex;
              justify-content: space-between;
              width: 61px;
            }
            .longInput{
              width: 330px;
            }
            .miniMargin{
              margin-bottom: 5px;
            }
            .longMargin{
              margin-top: 5px;
              margin-bottom: 10px;
            }
          }
        }
      }
      .actionList-content{
        margin-top: 15px;
        padding: 5px 5px;
        height: 207px;
        border: 1px solid #d8dce5;
        overflow: auto;
        background: #ECECEC;
        .cardItem{
          margin-bottom: 5px;
          .flexBox{
            display: flex;
            justify-content: space-between;
            font-size: 0;
            color: #999999;
            .detail{
              display: inline-block;
              vertical-align: top;
              margin: 5px 0 0 10px;
              font-size: 14px;
              .name{
                min-height: 16px;
                margin-bottom: 5px;
                color: #333333;
              }
            }
            .followUp{
              height: 16px;
              margin-top: 5px;
              font-size: 14px;
              .name{
                color: #333333;
              }
            }
            .item{
              .avatar{
                display: inline-block;
                width: 45px;
                height: 45px;
                border-radius: 50%;
              }
            }
          }
          .text{
            display:-webkit-box;
            overflow:hidden;
            text-overflow:ellipsis;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
            font-size: 14px;
            color: #333;
          }
          .address-content{
            font-size: 14px;
            color: #999;
            .address{
              width: 15px;
              vertical-align: top;
            }
            .addressDetail{
              line-height: 35px;
            }
          }
        }
        .noneActionMsg{
          width: 100%;
          height: 100%;
          line-height: 200px;
          text-align: center;
          font-size: 20px;
          background: #fff;
        }
      }
    }
    .linkman-content{
      .button-content{
        margin-left: 15px;
        margin-bottom: 10px;
      }
    }
    .clientPrice-content{
      .button-content{
        margin-left: 15px;
        margin-bottom: 10px;
      }
      .list-content{
        padding: 0 5px;
        height: 580px;
        padding: 5px;
        overflow: auto;
        border: 1px solid #D4D4D4;
        .listItem{
          box-sizing: border-box;
          width: 100%;
          height: 95px;
          padding: 5px 0;
          margin-bottom: 5px;
          border: 1px solid #CCCCCC;
          text-align: center;
          font-size: 0;
          cursor: pointer;
          &.active{
            border: 1px solid #01B8E2;
          }
          .type{
            vertical-align: top;
            display: inline-block;
            width: 25%;
            height: 100%;
            padding-top: 10px;
            border-right: 1px solid #ccc;
            font-size: 14px;
            .type-content{
              margin-top: 10px;
              margin-bottom: 10px;
              .businessType{
                display: inline-block;
                font-size: 18px;
                font-weight: 500;
              }
              .state{
                display: inline-block;
                margin-left: 10px;
                border: 1px solid #498CF8;
                color: #498CF8;
              }
            }
            .title{
              font-size: 16px;
            }
          }
          .fixedBox{
            vertical-align: top;
            display: inline-block;
            height: 100%;
            width: 15%;
            padding-top: 10px;
            border-right: 1px solid #ccc;
            font-size: 14px;
            .number{
              display: inline-block;
              color: #498CF8;
              font-size: 30px;
              font-weight: 600;
            }
            .unit{
              display: inline-block;
              font-size: 14px;
              color: #333333;
            }
            .numberDetail{
              margin-bottom: 10px;
            }
          }
          .payDetail{
            position: relative;
            vertical-align: top;
            display: inline-block;
            width: 30%;
            height: 100%;
            padding-top: 10px;
            font-size: 14px;
            .payType-content{
              display: -webkit-box;
              box-sizing: border-box;
              height: 50px;
              padding: 0 15px;
              margin-bottom: 5px;
              overflow: hidden;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              text-align: left;
              font-size: 14;
              .title{
                display: inline-block;
              }
              .payTypeDetail{
                -webkit-line-clamp:2;
              }
            }
            .more{
              position: absolute;
              left: 40%;
              bottom: 0;
              color: #498CF8;
              cursor: pointer;
            }
          }
          .title{
            font-size: 14px;
            color: #999999;
          }
        }
      }
    }
  }
  .loadingIcon{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.share-content{
  display: flex;
  justify-content: space-around;
  width: 100%;
  .shareItem{
    flex: 1;
    text-align: center;
    .downStyle{
      margin-top: 15px;
      font-size: 18px;
      color: #1f9bd6;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.dialog-content{
  .dialogFlexBox{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item{
      flex: 45%;
      .input{
        width: 200px;
      }
      .el-date-editor{
        width: 200px;
      }
    }
  }
  .btnContent{
    width: 50px;
    margin: 0 auto;
    text-align: center;
  }
}
.mask{
  z-index: 5;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,0.5);
}
.mask-enter-active,.mask-leave-active{
  transition: opacity .5s;
}
.mask-enter,.mask-leave-to{
  opacity: 0;
}
.pop-enter-active,.pop-leave-active{
  transition: right .5s;
}
.pop-enter,.pop-leave-to{
  right: -830px;
}
</style>
<style lang="scss">
  /*修改标签页的字体大小*/
  .tabs{
    .el-tabs__header{
      .el-tabs__item{
        font-size: 15px;
      }
    }
  }
  /*tag*/
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .dialogFlexBox .el-form-item--small .el-form-item__label{
    width:70px;
  }
  .dialog-content .el-dialog__header .el-dialog__title,.dialog__title2{
    color: #F08300;
    padding-left:5px;
    border-left:3px solid #F08300;
    width: 100%;
    line-height: 24px;
    font-size: 18px;
  }
  .dialog-content .el-dialog__header{
    padding-left: 0;
  }
  .dialog-content .el-dialog__body{
    padding-left: 0;
  }
  .dialog-content .el-button--primary{
    background: -webkit-gradient(linear, left bottom, left top, from(#F08300), to(#FABD00));
    background: -webkit-linear-gradient(bottom, #F08300, #FABD00);
    background: -o-linear-gradient(bottom, #F08300, #FABD00);
    background: linear-gradient(to top, #F08300, #FABD00);
    border-color: #FABD00;
  }
  .dialogFlexBox .el-radio__input.is-checked + .el-radio__label{
    color: #F08300;
  }
  .dialogFlexBox .el-radio__input.is-checked .el-radio__inner {
    border-color: #F08300;
    background: #F08300;
  }
  .dialogFlexBox .el-radio__inner:hover{
    border-color: #F08300;
  }
</style>
