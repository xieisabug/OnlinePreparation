package com.xjy.op.web.command;

public class TextCommand {
    private String delta;
    private Integer id;

    public String getDelta() {
        return delta;
    }

    public void setDelta(String delta) {
        this.delta = delta;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "TextCommand{" +
                "delta='" + delta + '\'' +
                ", id=" + id +
                '}';
    }
}
