package com.xjy.op.dto;

import java.util.List;

public class SlideDto {
    private int id;
    private int fileId;
    private List<SlidePartDto> parts;

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

    public List<SlidePartDto> getParts() {
        return parts;
    }

    public void setParts(List<SlidePartDto> parts) {
        this.parts = parts;
    }

    @Override
    public String toString() {
        return "SlideDto{" +
                "id=" + id +
                ", fileId=" + fileId +
                ", parts=" + parts +
                '}';
    }
}
