package com.xjy.op.dto;

import java.util.List;

public class SlidePartDto {
    private int id;
    private int slideId;
    private String content;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSlideId() {
        return slideId;
    }

    public void setSlideId(int slideId) {
        this.slideId = slideId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "SlidePartDto{" +
                "id=" + id +
                ", slideId=" + slideId +
                ", content='" + content + '\'' +
                '}';
    }
}
