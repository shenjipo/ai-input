<template>
    <div class="test">
        <MEditorVue2 ref="editorRef" v-model="inputValue" @imageInput="handleFileChange" @fileReject="handleFileReject">
            <SlashMention />

            <template #header>
                <div class="mention-header">
                    <el-image v-for="image in files" :src="image.url" :key="image.url" fit="cover"
                        :preview-src-list="[image.url]">

                    </el-image>
                </div>
            </template>

            <template #footer>
                <div class="mention-footer">
                    <div class="footer-left">
                        <el-button type="primary" @click="handleClick">打印内容</el-button>
                        <el-button type="primary" @click="handleInsert">插入mention</el-button>
                        <el-button type="primary" @click="handleDelete">清空内容</el-button>
                    </div>

                    <div class="footer-right">
                        <el-button round size="small" type="primary" icon="el-icon-top"></el-button>
                    </div>

                </div>
            </template>
        </MEditorVue2>
    </div>

</template>

<script lang="ts" src="./index.ts">

</script>


<style lang="scss" scoped>
.test {
    .mention-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .el-image {
            width: 52px;
            height: 52px;
        }

        .el-image:not(:first-child) {
            margin-left: 16px;
        }
    }

    .mention-footer {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .footer-left {}

        .footer-right {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
