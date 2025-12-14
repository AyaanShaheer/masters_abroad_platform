"""add sops table

Revision ID: b4ab20f97a24
Revises: <PUT_PREVIOUS_REVISION_HERE>
Create Date: 2025-12-14 17:55:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b4ab20f97a24'
down_revision = 'e1f3410aa20a'  # Check the last migration file's revision ID
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('sops',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('program_id', sa.Integer(), nullable=True),
    sa.Column('overall_score', sa.Float(), nullable=True),
    sa.Column('clarity_score', sa.Float(), nullable=True),
    sa.Column('motivation_score', sa.Float(), nullable=True),
    sa.Column('coherence_score', sa.Float(), nullable=True),
    sa.Column('relevance_score', sa.Float(), nullable=True),
    sa.Column('grammar_score', sa.Float(), nullable=True),
    sa.Column('strengths', sa.Float(), nullable=True),
    sa.Column('weaknesses', sa.Float(), nullable=True),
    sa.Column('suggestions', sa.Float(), nullable=True),
    sa.Column('word_count', sa.Integer(), nullable=True),
    sa.Column('reading_level', sa.String(), nullable=True),
    sa.Column('is_generated', sa.Boolean(), nullable=True),
    sa.Column('version', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['program_id'], ['programs.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('sops')
