package com.xjy.op.dto;

public class CoordinationDto {
    private int id;
    private int fileId;
    private int spaceId;

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

    public int getSpaceId() {
        return spaceId;
    }

    public void setSpaceId(int spaceId) {
        this.spaceId = spaceId;
    }

    @Override
    public String toString() {
        return "CoordinationDto{" +
                "id=" + id +
                ", fileId=" + fileId +
                ", spaceId=" + spaceId +
                '}';
    }
}
