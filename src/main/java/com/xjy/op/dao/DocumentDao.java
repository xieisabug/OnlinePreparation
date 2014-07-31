package com.xjy.op.dao;

import com.xjy.op.dto.DocumentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
@Transactional
public class DocumentDao {

    /**
     * 通过文件的id来取一个文档
     *
     * @param fileId 文件的id
     * @return 查询到的文档
     */
    public DocumentDto getDocumentByFileId(int fileId) {
        return jdbcTemplate.queryForObject("select * from op_file_document where fileId=?",
                new Object[]{fileId},
                new DocumentMapper());
    }

    /**
     * 保存文档到数据库，通过文件的id
     *
     * @param fileId  文件的id
     * @param content 要保存的内容
     * @return 保存是否成功
     */
    public boolean saveDocumentByFileId(final int fileId, final String content) {
        return jdbcTemplate.update("update op_file_document set content=? where fileId=?",
                content, fileId) == 1;
    }

    public int createDocument(final String name, final int spaceId){
        final String sql = "insert into op_file(name,type) values(?,?)";
        final String sql2 = "insert into op_file_document(fileId, content) values(?,?)";
        final String sql3 = "insert into op_coordination(spaceId, fileId) values(?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        int updateNum = jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setString(1, name);
                ps.setString(2, "document");
                return ps;
            }
        }, keyHolder);
        if (updateNum != 1) {
            throw new RuntimeException("创建文件时错误");
        }
        int ret = keyHolder.getKey().intValue();
        if (jdbcTemplate.update(sql2, ret, "") != 1) {
            throw new RuntimeException("创建文本文档时错误");
        }
        if(jdbcTemplate.update(sql3, spaceId, ret) != 1) {
            throw new RuntimeException("文件挂接空间时发生错误");
        }
        return keyHolder.getKey().intValue();
    }


    private final class DocumentMapper implements RowMapper<DocumentDto> {
        @Override
        public DocumentDto mapRow(ResultSet resultSet, int i) throws SQLException {
            DocumentDto documentDto = new DocumentDto();
            documentDto.setId(resultSet.getInt("id"));
            documentDto.setFileId(resultSet.getInt("fileId"));
            documentDto.setContent(resultSet.getString("content"));
            return documentDto;
        }
    }

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setDatasource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
}
