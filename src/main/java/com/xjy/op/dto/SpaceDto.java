package com.xjy.op.dto;

import java.util.Date;

public class SpaceDto {
    private int id;
    private String spaceName;
    private int createUserId;
    private Date createDate;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSpaceName() {
        return spaceName;
    }

    public void setSpaceName(String spaceName) {
        this.spaceName = spaceName;
    }

    public int getCreateUserId() {
        return createUserId;
    }

    public void setCreateUserId(int createUserId) {
        this.createUserId = createUserId;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    @Override
    public String toString() {
        return "SpaceDto{" +
                "id=" + id +
                ", spaceName='" + spaceName + '\'' +
                ", createUserId=" + createUserId +
                ", createDate=" + createDate +
                '}';
    }
}
