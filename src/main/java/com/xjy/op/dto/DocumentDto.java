package com.xjy.op.dto;

public class DocumentDto {
    private int id;
    private int fileId;
    private String content;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getFileId() {
        return fileId;
    }

    public void setFileId(int fileId) {
        this.fileId = fileId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "DocumentDto{" +
                "id=" + id +
                ", fileId=" + fileId +
                ", content='" + content + '\'' +
                '}';
    }
}
